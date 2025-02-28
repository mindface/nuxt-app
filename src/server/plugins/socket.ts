import { toNodeListener } from "h3";
import { defineNitroPlugin } from "nitropack/dist/runtime/plugin";
import { createServer } from "node:http";
import { Server } from "socket.io";

export default defineNitroPlugin((nitroApp) => {
	console.log("Nitro App Server02:", nitroApp.h3App.websocket);
	nitroApp.hooks.hook("render:response", () => {
		const server = createServer(toNodeListener(nitroApp.h3App));
		console.log("io--------");
		console.log(globalThis.io);
		if (true) {
			// const listener = (nitroApp.options?.devServer?.server) ||
			// nitroApp.h3App?.websocket ||
			// nitroApp._internal?.server;

			setImmediate(() => {
				if (!server) {
					console.error("❌ server is still undefined.");
					return;
				}
				console.log("✅ server1 is now available.");

				const io = new Server(server, {
					path: "/socket.io",
					cors: {
						origin: "*",
						methods: ["GET", "POST"],
						credentials: true,
					},
					transports: ["polling", "websocket"],
				});

				io.engine.on("connection_error", (err) => {
					console.log("Connection error:", err);
				});

				io.on("connection", (socket) => {
					console.log("A user connected");

					socket.on("joinRoom", (roomId) => {
						socket.join(roomId);
						console.log(`User joined room ${roomId}`);
					});

					socket.on("newMessage", (message) => {
						if (socket.connected) {
							globalThis.io.to(message.roomId).emit("newMessage", message);
						} else {
							console.log("Socket is disconnected");
						}
					});

					socket.on("disconnect", () => {
						console.log("User disconnected");
					});
				});
			});

			if (!server) {
				console.error("❌ No server instance found. Exiting...");
				return;
			}

			console.log("✅ Nitro App Server1 is ready. Initializing Socket.IO...");
		}
	});
});

// import { Server as Engine } from "engine.io";
// import { defineEventHandler } from "h3";
// import { defineNitroPlugin } from "nitropack/dist/runtime/plugin";
// import { Server } from "socket.io";

// export default defineNitroPlugin((nitroApp) => {
// 	const engine = new Engine();
// 	const io = new Server();
// 	console.log("globalThis--------")
// 	io.bind(engine);

// 	io.on("connection", (socket) => {
// 		console.log("A user connected2");

// 		socket.on("joinRoom", (roomId) => {
// 	console.log("roomId--------")
// 			socket.join(roomId);
// 			console.log(`User joined room ${roomId}`);
// 		});

// 		socket.on("newMessage", (message) => {
// 			if (socket.connected) {
// 				io.to(message.roomId).emit("newMessage", message);
// 			} else {
// 				console.log("Socket is disconnected");
// 			}
// 		});

// 		socket.on("disconnect", () => {
// 			console.log("User disconnected");
// 		});
// 	});

// 	nitroApp.router.use("/socket.io/", defineEventHandler({
//     handler(event) {
//       (event.node.req as any).customContext = event.context;
//       const engineReq: any = {
// 				...event.node.req,
// 				_query: {},
// 			};
// 			engine.handleRequest(engineReq, event.node.res);
//       event._handled = true;
//     },
//     websocket: {
//       open(peer, message) {
// 				const req = (peer as any).ctx?.node?.req ?? null;
//         peer.send("pong");
// 				if (!req) {
// 					console.error("Failed to get request context.");
// 					return;
// 				}

// 				// @ts-expect-error private method
// 				engine.prepare(req);

// 				const rawSocket = req.socket;
// 				const websocket = peer.websocket;

//         // @ts-expect-error private method
//         engine.onWebSocket(req, rawSocket, websocket);
//       }
//     }
//   }));
// });
