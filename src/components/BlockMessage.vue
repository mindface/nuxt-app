<script setup lang="ts">
import { useNuxtApp } from "nuxt/app";
import { storeToRefs } from "pinia";
import { onMounted, onUnmounted, ref, watch } from "vue";
import { useAuthStore } from "../store/auth";
import { useMessageStore } from "../store/message";
import { useRoomStore } from "../store/room";
import { useSocketStore } from "../store/socket";

const { $toast, $t } = useNuxtApp();

const messageStore = useMessageStore();
const roomStore = useRoomStore();
const authStore = useAuthStore();
const socketStore = useSocketStore();
const { authUser } = storeToRefs(authStore);
const { messageList } = storeToRefs(messageStore);
const { currentRoom } = storeToRefs(roomStore);

const sendForm = ref();

const addMessageAction = async (e: Event) => {
	if (!currentRoom.value?.id) return;
	e.preventDefault();
	const formData = new FormData(sendForm.value);
	formData.append("roomId", currentRoom.value?.roomId);
	formData.append("senderId", String(authUser.value?.id));
	const res = await messageStore.createMessage(formData);
	if (res?.status === 201) {
		$toast.success("messageSuccess");
		await messageStore.getMessageList(currentRoom.value?.roomId);
	} else {
		$toast.error("messageError");
	}
	sendForm.value.reset();
};

watch(
	currentRoom,
	() => {
		if (currentRoom.value?.id) {
			messageStore.getMessageList(currentRoom.value?.roomId);
			socketStore.joinRoom(currentRoom.value?.roomId);
		}
		if (currentRoom.value?.roomId) {
			messageStore.connect(currentRoom.value.roomId);
		} else {
			messageStore.disconnect();
		}
	},
	{ immediate: true },
);

onMounted(() => {
	messageStore.listenForMessages(currentRoom.value?.roomId);
});
onUnmounted(() => {
	messageStore.disconnect();
});
</script>

<template>
<div class="message-box">
  <h4 class="title">{{ $t("comentArea") }}</h4>
  <div class="message-add">
    <form ref="sendForm" @submit.prevent="addMessageAction">
      <input type="text" name="content">
      <button class="border p-2" type="submit">add</button>
    </form>
    </div>
    <div class="select-room">{{ currentRoom?.room.name }}</div>
    <ul class="message-list">
      <li
        v-for="item in messageList"
        class="message-item"
      >
        <p class="p-3">{{ item.content ?? "no content" }}</p>
      </li>
    </ul>
</div>
</template>