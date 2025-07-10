import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const getSocket = (): Socket => {
	if (!socket) {
		socket = io("http://localhost:3001", {
			path: "/socket.io",
			transports: ["websocket", "polling"],
			reconnection: true,
			reconnectionAttempts: 5,
			reconnectionDelay: 1000,
		});
	}
	return socket;
};