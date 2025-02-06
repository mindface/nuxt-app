<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useTaskStore } from "../store/task";
import type { Task } from "../types/Task";

const title = ref("");
const body = ref("");

const taskStore = useTaskStore();

const props = defineProps({
	item: {
		type: Object as PropType<Task>,
		default: () => ({}),
	},
});

const updateAction = () => {
	const update = {
		...props.item,
	};
	taskStore.updateTask(update);
};
</script>

<template>
  <div class="card-item">
    <div class="inner">
      
    </div>
  </div>
</template>
