<script setup lang="ts">
import { storeToRefs } from "pinia";
const { $t } = useNuxtApp();

import { useAuthStore } from "../store/auth";
import { useTaskStore } from "../store/task";
const authStore = useAuthStore();
const taskStore = useTaskStore();
const { authUser } = storeToRefs(authStore);

const title = ref("");

const props = defineProps({
	type: {
		type: String,
		default: "task",
	},
});

const searchTaskAction = async () => {
	if (authUser.value?.id) {
		await taskStore.getTaskSearch(authUser.value?.id, title.value);
	}
};
</script>

<template>
  <div class="search-input flex justify-between p-2 bg-sky-300">
    <p class="field">
      <span class="text">{{ $t("searchAction") }}</span>
      <input
        type="text"
        class="search-input"
        v-model="title"
      />
    </p>
    <p v-if="props.type === 'task'" class="field">
      <button class="btn border back-gr" @click="searchTaskAction">task search</button>
    </p>
  </div>
</template>

<style scoped>
</style>
