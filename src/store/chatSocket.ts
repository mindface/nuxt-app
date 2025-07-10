import { useNuxtApp } from "nuxt/app";
import { defineStore } from "pinia";

export const useChatSocketStore = defineStore("chatSocket", () => {
	const { $socket } = useNuxtApp();

	const joinRoom = (roomId: string) => {
		$socket.emit("getRoomMessage", roomId);
	};

	const sendMessage = (roomId: string, senderId: number, content: string) => {
		$socket.emit("newMessage", { roomId, senderId, content });
	};

	return { joinRoom, sendMessage };
});
