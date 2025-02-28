import { defineStore } from "pinia";
import { io } from "socket.io-client";

export const useSocketStore = defineStore("socket", () => {
	const socket = io("http://localhost:3000");

	const joinRoom = (roomId: string) => {
		console.log("------------", roomId);
		socket.emit("joinRoom", roomId);
	};

	const sendMessage = (roomId: string, senderId: number, content: string) => {
		socket.emit("newMessage", { roomId, senderId, content });
	};

	return { socket, joinRoom, sendMessage };
});
