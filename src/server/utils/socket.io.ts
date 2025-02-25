import { defineNitroPlugin } from "#imports";
import { Server as Engine } from "engine.io";
import { defineEventHandler } from "h3";
import { Server } from "socket.io";

export default defineNitroPlugin((nitroApp) => {
	const engine = new Engine();
	const io = new Server();

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
				engine.handleRequest(event.node.req, event.node.res);
				event._handled = true;
			},
			websocket: {
				open(peer) {
					// @ts-expect-error private method and property
					engine.prepare(peer._internal.nodeReq);
					// @ts-expect-error private method and property
					engine.onWebSocket(
						peer._internal.nodeReq,
						peer._internal.nodeReq.socket,
						peer.websocket,
					);
				},
			},
		}),
	);
});
