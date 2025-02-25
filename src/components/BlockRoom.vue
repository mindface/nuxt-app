<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useAuthStore } from "../store/auth";
import { useRoomStore } from "../store/room";

import { UserRoom } from "../types/Room";

const { $t } = useNuxtApp();

const roomStore = useRoomStore();
const authStore = useAuthStore();
const { authUser } = storeToRefs(authStore);
const { roomList } = storeToRefs(roomStore);

const sendForm = ref();

const addRoomAction = (e: Event) => {
	e.preventDefault();
	const formData = new FormData(sendForm.value);
	formData.append("userId", String(authUser.value?.id));
	roomStore.createRoom(formData);
};

const setRoom = (item: UserRoom) => {
	roomStore.setRoom(item);
};

onMounted(() => {
	if (authUser.value?.id) {
		roomStore.getRoomList(authUser.value?.id);
	}
});
</script>

<template>
  <div class="room-box">
    <h4 class="title">{{ $t("roomArea") }}</h4>
    <div class="room-add">
      <form ref="sendForm" @submit.prevent="addRoomAction">
        <input type="text" name="name">
        <button class="border p-2" type="submit">add</button>
      </form>
    </div>
    <ul class="room-list">
      <li
        v-for="item in roomList"
        class="room-item"
      >
        <p class="p-3">{{ item.room.name ?? "no name" }}</p>
        <p class="p-3"><button class="border" @click="setRoom(item)">set room</button></p>
      </li>
    </ul>
  </div>
</template>