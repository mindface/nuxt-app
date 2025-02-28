import { defineStore } from "pinia";
import type { RoomResponse } from "~/types/ApiRespose";
import type { AddRoom, Room } from "../types/Room";

export const roomStore = defineStore("room", () => {
	const roomList = ref<Room[]>([]);
	const headers = {
		"Content-Type": "application/json",
		Authorization: `Bearer ${useCookie("auth_token").value}`,
	};

	async function getRoomList(userId: number) {
		try {
			const data = (await $fetch(`/api/room?userId=${userId}`, {
				method: "GET",
				headers: headers,
			})) as RoomResponse;
			if (data) {
				roomList.value = data.rooms ?? [];
			}
		} catch (error) {
			console.error(error);
		}
	}
	async function createTask(addItem: AddRoom) {
		try {
			const data = (await $fetch("/api/room", {
				method: "PUT",
				headers: headers,
				body: JSON.stringify(addItem),
			})) as RoomResponse;
		} catch (error) {
			console.error(`error`, error);
		}
	}

	return {
		roomList,
		getRoomList,
		createTask,
	};
});
