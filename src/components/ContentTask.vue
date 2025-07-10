<script setup lang="ts">
import { storeToRefs } from "pinia";
import { onMounted } from "vue";
import { useAuthStore } from "../store/auth";
import { useTaskStore } from "../store/task";
import ContentTaskEdit from "./ContentTaskEdit.vue";

const taskStore = useTaskStore();
const authStore = useAuthStore();
const { authUser } = storeToRefs(authStore);

onMounted(() => {
	if (authUser.value?.id) {
		taskStore.getTaskList(authUser.value?.id);
	}
});
</script>

<template>
  <div>
    content task001
    <content-task-edit />
  </div>
</template>
