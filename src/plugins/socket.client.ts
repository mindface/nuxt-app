import { defineNuxtPlugin } from "nuxt/app";
import { io } from "socket.io-client";

export default defineNuxtPlugin((nuxtApp) => {
	const socket = io("ws://localhost:3000", {
		path: "/socket.io",
		transports: ["polling", "websocket"],
		reconnection: true,
		reconnectionAttempts: 5,
		reconnectionDelay: 1000,
	});

	socket.on("connect", () => {
		console.log("✅ Connected to server");
	});

	socket.on("connect_error", (err) => {
		console.error("❌ Connection error:", err);
	});

	socket.on("joinRoom", (roomId) => {
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
		console.log("Disconnected from server");
	});

	nuxtApp.provide("socket", socket);

	socket.on("receiveMessage", (message) => {
		console.log("Received message: ", message);
	});
});
