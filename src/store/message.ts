import { defineStore, storeToRefs } from "pinia";
import { io } from "socket.io-client";
import { ref } from "vue";
import type { Message } from "../types/Message";
import { useRoomStore } from "./room";

export const useMessageStore = defineStore("message", () => {
	const roomStore = useRoomStore();
	const { currentRoom } = storeToRefs(roomStore);
	const messageList = ref<Message[]>([]);
	const socket = ref<any>(null);
	const socketIO = io("http://localhost:3000", {
		path: "/socket.io",
		transports: ["websocket"],
		reconnection: true,
		reconnectionAttempts: 5,
		reconnectionDelay: 1000,
	});

	socketIO.on("roomMessages", ({ roomId, messages }) => {
		if (currentRoom.value?.roomId === roomId) {
			messageList.value = messages;
		}
	});

	async function getMessageList(roomId: string) {
		socketIO.emit("getRoomMessage", roomId);
		// try {
		// 	const data = (await $fetch(`/api/message?roomId=${roomId}`, {
		// 		method: "GET",
		// 		headers: headersTypeJson(),
		// 	})) as MessageResponse;
		// 	if (data) {
		// 		messageList.value = data.messages ?? [];
		// 	}
		// } catch (error) {
		// 	console.error(error);
		// }
	}
	// async function createMessage(formData: FormData) {
	// 	try {
	// 		const data = (await $fetch("/api/message", {
	// 			method: "POST",
	// 			headers: headerOnlyBearer(),
	// 			body: formData,
	// 		})) as MessageResponse;
	// 		if (data.status === 201) {
	// 			return { status: data.status, message: "messageSuccess" };
	// 		} else {
	// 			return { status: data.status, message: "messageError" };
	// 		}
	// 	} catch (error) {
	// 		console.error(`error`, error);
	// 	}
	// }

	async function createMessage(
		roomId: string,
		senderId: number,
		content: string,
	) {
		socketIO.emit("newMessage", { roomId, senderId, content });
	}

	function listenForMessages(roomId: string) {
		if (!socket.value) {
			socket.value = io("http://localhost:3000");
		}

		socket.value.on("newMessage", (newMessage: Message) => {
			messageList.value.push(newMessage);
		});

		socket.value.emit("joinRoom", roomId);
	}

	function connect(roomId: string) {
		if (!socket.value || !socket.value.connected) {
			socket.value = io("http://localhost:3000");

			socket.value.on("connect", () => {
				console.log("Connected to WebSocket");
				socket.value?.emit("joinRoom", roomId);
			});

			socket.value.on("disconnect", () => {
				console.log("Disconnected from WebSocket");
			});

			socket.value.on("newMessage", (newMessage: Message) => {
				if (
					newMessage.roomId === roomId &&
					!messageList.value.find((m) => m.id === newMessage.id)
				) {
					messageList.value.push(newMessage);
				}
			});
		} else {
			socket.value.emit("joinRoom", roomId);
		}
	}

	function disconnect() {
		if (socket.value) {
			socket.value.disconnect();
			socket.value = null;
			messageList.value = [];
		}
	}

	return {
		messageList,
		getMessageList,
		createMessage,
		listenForMessages,
		connect,
		disconnect,
	};
});
