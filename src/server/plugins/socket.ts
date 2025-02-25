import { defineNitroPlugin } from "#imports";
import { createServer } from "http";
import { Server } from "socket.io";

let io;

export default defineNitroPlugin((nitroApp) => {
	if (!io) {
		const httpServer = createServer((req, res) => {
			res.writeHead(200, { "Content-Type": "text/plain" });
			res.end("Socket.IO server is running");
		});
		io = new Server(nitroApp.server, {
			path: "/socket.io",
			cors: {
				origin: "*",
				methods: ["GET", "POST"],
				// credentials: true,
			},
			transports: ["websocket"],
		});
		// io = new Server(httpServer, {
		//   cors: {
		//     origin: '*',
		//     methods: ['GET', 'POST'],
		//   },
		// });

		io.on("connection", (socket) => {
			console.log("A user connected");

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
	}

	return { io };
});
