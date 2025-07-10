import { Server as Engine } from "engine.io";
import { defineEventHandler } from "h3";
import { defineNitroPlugin } from "nitropack/dist/runtime/plugin";
import { Server } from "socket.io";

export default defineNitroPlugin((nitroApp) => {
	const engine = new Engine();
	const io = new Server();
	console.log("globalThis--------");
	console.log(globalThis);
	io.bind(engine);

	io.on("connection", (socket) => {
		console.log("A user connected2");

		socket.on("joinRoom", (roomId) => {
			socket.join(roomId);
			console.log(`User joined room ${roomId}`);
		});

		socket.on("newMessage", (message) => {
			if (socket.connected) {
				io.to(message.roomId).emit("newMessage", message);
			} else {
				console.log("Socket is disconnected");
			}
		});

		socket.on("disconnect", () => {
			console.log("User disconnected");
		});
	});

	nitroApp.router.use(
		"/socket.io/",
		defineEventHandler({
			handler(event) {
				console.log("socket.io-|-handler");
				(event.node.req as any).customContext = event.context;
				const engineReq: any = {
					...event.node.req,
					_query: {},
				};
				engine.handleRequest(engineReq, event.node.res);
				event._handled = true;
			},
			websocket: {
				open(peer) {
					const req = (peer as any).ctx?.node?.req ?? null;
					if (!req) {
						console.error("Failed to get request context.");
						return;
					}

					// @ts-expect-error private method
					engine.prepare(req);

					const rawSocket = req.socket;
					const websocket = (peer as any).ctx?.node?.ws;

					// @ts-expect-error private method
					engine.onWebSocket(req, rawSocket, websocket);
				},
			},
		}),
	);

	// nitroApp.router.use(
	// 	"/socket.io/",
	// 	defineEventHandler({
	// 		handler(event) {
	// 			engine.handleRequest(event.node.req, event.node.res);
	// 			event._handled = true;
	// 		},
	// 		websocket: {
	// 			open(peer) {
	// 				// @ts-expect-error private method and property
	// 				engine.prepare(peer._internal.nodeReq);
	// 				// @ts-expect-error private method and property
	// 				engine.onWebSocket(
	// 					peer._internal.nodeReq,
	// 					peer._internal.nodeReq.socket,
	// 					peer.websocket,
	// 				);
	// 			},
	// 		},
	// 	}),
	// );
});
