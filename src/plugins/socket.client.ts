import { defineNuxtPlugin } from "nuxt/app";
import { io } from "socket.io-client";

export default defineNuxtPlugin((nuxtApp) => {
	const socket = io("http://localhost:3000", {
		transports: ["websocket"],
		reconnection: true,
		reconnectionAttempts: 5,
		reconnectionDelay: 1000,
	});

	socket.on("connect", () => {
		console.log("Connected to server");
	});

	socket.on("disconnect", () => {
		console.log("Disconnected from server");
	});

	socket.on("connect_error", (err) => {
		console.error("Connection error:", err.message);
	});

	nuxtApp.provide("socket", socket);

	socket.on("receiveMessage", (message) => {
		console.log("Received message: ", message);
	});
});
