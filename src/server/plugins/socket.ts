import { toNodeListener } from "h3";
import { defineEventHandler } from "h3";
// import { defineNitroPlugin } from "nitropack/dist/runtime/plugin";
import { createServer } from "node:http";
// import { Server } from "socket.io";
const httpServer = createServer();

import { Server as Engine } from "engine.io";
import { defineNitroPlugin } from "nitropack/dist/runtime/plugin";
import { Server } from "socket.io";
import messageService from "../services/messageService";

export default defineNitroPlugin((nitroApp) => {
	const engine = new Engine();
	const l = toNodeListener(nitroApp.h3App);
	const server = createServer(l);
	if (!globalThis.io) {
		globalThis.io = new Server(server, {
			path: "/socket.io",
			cors: {
				origin: "*", 
				methods: ["GET", "POST"],
				credentials: true,
			},
			transports: ["polling", "websocket"],
			pingTimeout: 60000,
			pingInterval: 25000,
		});
		globalThis.io.bind(engine);
		if (import.meta.dev) {
			server.listen(3001, "0.0.0.0", () => {
				console.log("Socket.IO listening on http://localhost:3001");
			});
		}

		const io = globalThis.io;

		const originalTo = io.to.bind(io);
		io.to = function (...args: any[]) {
			const roomId = args[0];
			const roomSockets = io.sockets.adapter.rooms.get(roomId);
			if (!roomSockets || roomSockets.size === 0) {
				console.warn(`[io.to OVERRIDE] Room ${roomId} is empty or does not exist.`);
			} else {
				console.log(`[io.to OVERRIDE] Room ${roomId} has ${roomSockets.size} members.`);
			}

			const operator = originalTo(...args);

			const originalEmit = operator.emit.bind(operator);
			operator.emit = function (event: any, ...payload: any[]) {
				console.log(`[io.to.emit OVERRIDE] Emitting to room ${roomId}:`, { event, payload });
				return originalEmit(event, ...payload);
			};

			return operator;
		};

		io.on("connection", (socket) => {
			console.log("A user connected");
			const originalOn = socket.onevent;
			socket.onevent = function (packet) {
				console.log("Received event:", packet.data[0], packet.data.slice(1));
				originalOn.call(this, packet);
			};

			socket.on("joinRoom", async (roomId: string, userId: number) => {
				await socket.join(roomId)
				const roomSockets = io.sockets.adapter.rooms.get(roomId);
				console.log(`Room ${roomId} has ${roomSockets?.size || 0} sockets`);
			});

			socket.on("getRoomMessage", async (roomId: string, userId: number) => {
				try {
					const messages = await messageService.getRoomMessages(roomId);
					socket.emit("roomMessages", { roomId, messages });
				} catch (error) {
					console.error(`Failed to fetch messages for room ${roomId}:`, error);
					socket.emit("error", { message: "Failed to fetch room messages" });
				}
			});

			socket.on(
				"newMessage",
				async (message: {
					roomId: string;
					senderId: number;
					content: string;
				}) => {
					if (socket.connected) {
						// socket.to(message.roomId).emit("newMessage", message);
						try {
              const namespace = io.of("/");
              const sockets = await namespace.fetchSockets();

								for (const socketer of sockets) {
									if (socketer.rooms.has(message.roomId)) {
										console.log("ソケットID:", socketer.id);
										console.log("ルーム所属:", socketer.rooms);
										console.log(
											"ルームチェック:",
											socketer.rooms.has(message.roomId),
										);
									}
								}

								const messages = await messageService.getRoomMessages(
									message.roomId,
								);

								// ルーム内の全ソケットにメッセージを送信
								// io.to(message.roomId).emit("roomMessages", {
								// 	roomId: message.roomId,
								// 	messages,
								// });

								// await socket.join(message.roomId)
								console.log(`Message sent to room ${message.roomId}`)
								// デバッグ用：ルーム内のソケット情報を確認
								const roomSockets = io.sockets.adapter.rooms.get(message.roomId);
								if (roomSockets) {
									console.log(`Room ${message.roomId} sockets:`, Array.from(roomSockets));
								}
								setTimeout(() => {
									io.to(message.roomId).emit("roomMessages", { roomId: message.roomId, messages });
								}, 50);
							} catch (error) {
								console.error("Error sending message:", error);
								socket.emit("error", { message: "Failed to send message" });
							}
						} else {
							console.log("Socket is disconnected");
						}
				})
			socket.on("disconnect", () => {
				console.log("User disconnected:", socket.id);
			});
			// if (import.meta.dev) {
			//   server.listen(3001, () => {
			//     console.log("Socket.IO server listening on http://localhost:3001");
			//   });
			// }
		});
	}

});
