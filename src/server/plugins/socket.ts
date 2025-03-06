import { toNodeListener } from "h3";
import { parse } from "url";
// import { defineNitroPlugin } from "nitropack/dist/runtime/plugin";
import { createServer } from "node:http";
// import { Server } from "socket.io";

// export default defineNitroPlugin(async (nitroApp) => {
// 	console.log("Nitro App Server02:");
// 	nitroApp.hooks.hook("request", (_server) => {
// 		const l = toNodeListener(nitroApp.h3App);
// 		const server = createServer(l);
// 		const io = new Server(server, {
// 			// path: "/socket.io",
// 			cors: {
// 				origin: "*",
// 				methods: ["GET", "POST"],
// 				credentials: true,
// 			},
// 			transports: ["polling", "websocket"],
// 			pingTimeout: 60000,
// 			pingInterval: 25000,
// 		});
// 		// io.listen(3000,()=>{});

// 		io.on("connection_error", (err) => {
// 			console.error("Connection error details:", JSON.stringify(err, null, 2));
// 		});

// 		io.on("connection", (socket) => {
// 			console.log("A user connected");

// 			socket.on("joinRoom", (roomId: string) => {
// 				socket.join(roomId);
// 				console.log(`User joined room ${roomId}`);
// 			});

// 			socket.on("newMessage", (message: { roomId: string }) => {
// 				if (socket.connected) {
// 					globalThis.io.to(message.roomId).emit("newMessage", message);
// 				} else {
// 					console.log("Socket is disconnected");
// 				}
// 			});

// 			socket.on("disconnect", () => {
// 				console.log("User disconnected");
// 			});
// 		});
// 	});
// });

import { Server as Engine } from "engine.io";
import { defineEventHandler } from "h3";
import { defineNitroPlugin } from "nitropack/dist/runtime/plugin";
import { Server } from "socket.io";
import messageService from "../services/messageService";

export default defineNitroPlugin((nitroApp) => {
	const engine = new Engine();
	if (!globalThis.io) {
		const l = toNodeListener(nitroApp.h3App);
		const server = createServer(l);
		// new Server()だけでも実装して動く
		globalThis.io = new Server(server, {
			// path: "/socket.io",
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
	}

	const io = globalThis.io;

	io.on("connection", (socket) => {
		console.log("A user connected");

		socket.on("joinRoom", async (roomId: string, userId: number) => {
			const currentRooms = Array.from(socket.rooms);
			currentRooms.forEach((room) => {
				if (room !== socket.id) {
					socket.leave(room);
				}
			});
			socket.join(roomId);
			console.log(`User joined room ${roomId}`);
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
						const resmessage = await messageService.sendMessage(
							message.roomId,
							message.senderId,
							message.content,
						);
						const messages = await messageService.getRoomMessages(
							message.roomId,
						);
						// const roomSockets = io.sockets.adapter.rooms.get(message.roomId);
						// if (roomSockets) {
						// 	roomSockets.forEach((socketId) => {
						// 		const socket = io.sockets.sockets.get(socketId);
						// 		socket.emit("roomMessages", {
						// 			roomId: message.roomId,
						// 			messages,
						// 		});
						// 	});
						// }
						socket.except(message.roomId).emit("roomMessages", {
							roomId: message.roomId,
							messages,
						});
					} catch (error) {
						console.error(error);
					}
				} else {
					console.log("Socket is disconnected");
				}
			},
		);

		socket.on("disconnect", () => {
			console.log("User disconnected");
		});
	});

	nitroApp.router.use(
		"/socket.io/",
		defineEventHandler({
			handler(event) {
				const parsedUrl = parse(event.node.req.url || "", true);

				const queryParams: Record<string, string> = Object.fromEntries(
					Object.entries(parsedUrl.query || {}).map(([key, value]) => [
						key,
						Array.isArray(value) ? value[0] : (value || "").toString(),
					]),
				);

				const engineReq = Object.assign(event.node.req, {
					_query: queryParams,
				});

				engine.handleRequest(engineReq, event.node.res);
				event._handled = true;
			},
			websocket: {
				open(peer) {
					// @ts-expect-error private method and property
					engine.prepare(peer._internal.nodeReq);
					// @ts-expect-error private method and property
					// console.log("peer");
					// console.log(peer._internal);
					engine.onWebSocket(
						peer._internal.nodeReq,
						peer._internal.nodeReq.socket,
						peer.websocket,
					);
				},
			},
		}),
	);

	// nitroApp.router.use("/socket.io/", defineEventHandler({
	//   handler(event) {
	//     (event.node.req as any).customContext = event.context;
	//     const engineReq: any = {
	// 			...event.node.req,
	// 			_query: {},
	// 		};
	// 		engine.handleRequest(engineReq, event.node.res);
	//     event._handled = true;
	//   },
	//   websocket: {
	//     open(peer, message) {
	// 			const req = (peer as any).ctx?.node?.req ?? null;
	//       peer.send("pong");
	// 			if (!req) {
	// 				console.error("Failed to get request context.");
	// 				return;
	// 			}

	// 			// @ts-expect-error private method
	// 			engine.prepare(req);

	// 			const rawSocket = req.socket;
	// 			const websocket = peer.websocket;

	//       // @ts-expect-error private method
	//       engine.onWebSocket(req, rawSocket, websocket);
	//     }
	//   }
	// }));
});
