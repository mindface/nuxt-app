import { defineStore } from "pinia";
import { io } from "socket.io-client";
import { ref } from "vue";
import type { RoomResponse } from "../types/ApiRespose";
import type { UserRoom } from "../types/Room";
import { headerOnlyBearer, headersTypeJson } from "../utils/headers-helper";

export const useRoomStore = defineStore("room", () => {
	const roomList = ref<UserRoom[]>([]);
	const currentRoom = ref<UserRoom>();
	const socketIO = io("http://localhost:3000", {
		path: "/socket.io",
		transports: ["websocket"],
		reconnection: true,
		reconnectionAttempts: 5,
		reconnectionDelay: 1000,
	});

	const setRoom = (setItem: UserRoom) => {
		currentRoom.value = setItem;
		socketIO.emit("joinRoom", setItem.roomId);
	};

	async function getRoomList(userId: number) {
		try {
			const data = (await $fetch(`/api/room?userId=${userId}`, {
				method: "GET",
				headers: headersTypeJson(),
			})) as RoomResponse;
			if (data) {
				roomList.value = data.rooms ?? [];
			}
		} catch (error) {
			console.error(error);
		}
	}
	async function createRoom(formData: FormData) {
		try {
			const data = await $fetch("/api/room", {
				method: "POST",
				headers: headerOnlyBearer(),
				body: formData,
			});
		} catch (error) {
			console.error(`error`, error);
		}
	}

	return {
		currentRoom,
		roomList,
		setRoom,
		getRoomList,
		createRoom,
	};
});
