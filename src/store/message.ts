import { defineStore } from "pinia";
import type { MessageResponse } from "~/types/ApiRespose";
import type { AddMessage, Message } from "../types/Message";
import { headersTypeJson } from "../utils/headers-helper";

export const messageStore = defineStore("message", () => {
	const messageList = ref<Message[]>([]);

	async function getMessageList(userId: number) {
		try {
			const data = (await $fetch(`/api/message?userId=${userId}`, {
				method: "GET",
				headers: headersTypeJson(),
			})) as MessageResponse;
			if (data) {
				messageList.value = data.messages ?? [];
			}
		} catch (error) {
			console.error(error);
		}
	}
	async function createMessage(addItem: AddMessage) {
		try {
			const data = await $fetch("/api/message", {
				method: "POST",
				headers: headersTypeJson(),
				body: JSON.stringify(addItem),
			});
		} catch (error) {
			console.error(`error`, error);
		}
	}

	return {
		messageList,
		getMessageList,
		createMessage,
	};
});
