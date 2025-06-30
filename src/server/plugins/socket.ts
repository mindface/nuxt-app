import { toNodeListener } from "h3";
// import { defineNitroPlugin } from "nitropack/dist/runtime/plugin";
import { createServer } from "node:http";
// import { Server } from "socket.io";
const httpServer = createServer();

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
				origin: "http://localhost:3000",
				methods: ["GET", "POST"],
				credentials: true,
			},
			transports: ["polling", "websocket"],
			pingTimeout: 60000,
			pingInterval: 25000,
		});
		globalThis.io.bind(engine);
		if (import.meta.dev) {
			server.listen(3001, () => {
				console.log("Socket.IO server listening on http://localhost:3001");
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
			console.log("A user connected:", socket.id);

			function logRoomsAndSockets() {
				const adapter = io.of("/").adapter;
				// console.log('===== ROOMS =====');
				// console.log('Rooms Map:', Array.from(adapter.rooms).map(([roomId, sockets]) => {
				// 	return { roomId, socketCount: sockets.size, socketIds: Array.from(sockets) };
				// }));
				// console.log('Sids Map:', Array.from(adapter.sids).map(([socketId, rooms]) => {
				// 	return { socketId, joinedRooms: Array.from(rooms) };
				// }));
			}

			// ブロードキャストをモニタリング
			const originalBroadcast = io.of("/").adapter.broadcast;
			// io.of('/').adapter.broadcast = function(packet, opts) {
			// 	console.log('===== BROADCAST =====');
			// 	console.log('Packet Type:', packet.type);
			// 	console.log('Event:', packet.data[0]);
			// 	console.log('Data:', packet.data.slice(1));
			// 	console.log('Target Rooms:', Array.from(opts.rooms || []));
			// 	console.log('Flags:', opts.flags);

			// 	// 各ルームのソケット情報
			// 	if (opts.rooms && opts.rooms.size > 0) {
			// 		console.log('===== TARGET SOCKETS =====');
			// 		opts.rooms.forEach(room => {
			// 			const socketsInRoom = this.rooms.get(room);
			// 			console.log(`Room "${room}":`, socketsInRoom ?
			// 				Array.from(socketsInRoom) : 'No sockets');
			// 		});
			// 	}

			// 	return originalBroadcast.call(this, packet, opts);
			// };

			socket.on("joinRoom", async (roomId: string, userId: number) => {
				// const currentRooms = Array.from(socket.rooms);
				// currentRooms.forEach((room) => {
				// 	if (room !== socket.id) {
				// 		socket.leave(room);
				// 	}
				// });
				// socket.join('test-room');
				// const currentRooms = Array.from(socket.rooms);
				// currentRooms.forEach((room) => {
				// 	if (room !== socket.id) {
				// 		socket.leave(room);
				// 	}
				// });
				await socket.join(roomId)

				// logRoomsAndSockets();
				// ルームが存在するか確認
				// console.log("Test room exists:", io.of('/').adapter.rooms.has('test-room'));
				// console.log("Test room rooms:", io.of('/').adapter.rooms);
				// console.log("io.adapter.socketRooms(socket.id)")
				// console.log(io.of('/').adapter.addSockets(io.of("/").adapter,[roomId]))
				// console.log(io.to(roomId))
				// socket.join(roomId);
				// console.log("Server configuration:");
				// 	console.log("transports:", io._opts.transports)
				// 	console.log("pingTimeout:", io._opts.pingTimeout)
				// 	console.log("pingInterval:", io._opts.pingInterval)
				// 	console.log("upgradeTimeout:", io._opts.upgradeTimeout)
				// 	console.log("maxHttpBufferSize:", io._opts.maxHttpBufferSize)
				// 	console.log("cors:", io._opts.cors)
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
							// const resmessage = await messageService.sendMessage(
							// 	message.roomId,
							// 	message.senderId,
							// 	message.content,
							// )
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
										// console.log("socket", socket);
										// console.log("socketer", socketer);
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

								await socket.join(message.roomId)
								console.log(`Message sent to room ${message.roomId}`)
								// デバッグ用：ルーム内のソケット情報を確認
								const roomSockets = io.sockets.adapter.rooms.get(message.roomId);
								if (roomSockets) {
									console.log(`Room ${message.roomId} sockets:`, Array.from(roomSockets));
								}
								setTimeout(() => {
									io.to(message.roomId).emit("roomMessages", { roomId: message.roomId, messages });
								}, 50);
								// io.emit("roomMessages", {
								// 	roomId: message.roomId,
								// 	messages,
								// });
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

	// nitroApp.router.use(
	// 	"/socket.io/",
	// 	defineEventHandler({
	// 		handler(event) {
	// 			const parsedUrl = parse(event.node.req.url || "", true);

	// 			const queryParams: Record<string, string> = Object.fromEntries(
	// 				Object.entries(parsedUrl.query || {}).map(([key, value]) => [
	// 					key,
	// 					Array.isArray(value) ? value[0] : (value || "").toString(),
	// 				]),
	// 			);

	// 			const engineReq = Object.assign(event.node.req, {
	// 				_query: queryParams,
	// 			});

	// 			engine.handleRequest(engineReq, event.node.res);
	// 			event._handled = true;
	// 		},
	// 		websocket: {
	// 			open(peer) {
	// 				// @ts-expect-error private method and property
	// 				engine.prepare(peer._internal.nodeReq);
	// 				// console.log("peer");
	// 				// console.log(peer._internal);
	// 				// @ts-expect-error private method and property
	// 				engine.onWebSocket(
	// 					// @ts-expect-error private method and property
	// 					peer._internal.nodeReq,
	// 					// @ts-expect-error private method and property
	// 					peer._internal.nodeReq.socket,
	// 					peer.websocket,
	// 				);
	// 			},
	// 		},
	// 	}),
	// );

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
