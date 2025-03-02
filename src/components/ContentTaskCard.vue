<script setup lang="ts">
import { PropType, ref } from "vue";
import { useTaskStore } from "../store/task";
import type { Task } from "../types/Task";
import PartsActionBtns from "./PartsActionBtns.vue";

const taskStore = useTaskStore();

const viewSwitch = ref(false);

const emit = defineEmits(["updateAction", "setAction"]);

const { item } = defineProps({
	item: {
		type: Object as PropType<Task>,
		default: () => ({}),
	},
});

const taskItem = ref<Task | null>();

const setUpdateTaskAction = () => {
	emit("updateAction");
};

const deleteTaskAction = (task: Task) => {
	if (confirm("この操作は取り消せません。削除しますか？")) {
		taskStore.deleteTask(task);
		emit("setAction");
	}
};

const viewCardAcction = (task: Task) => {
	viewSwitch.value = !viewSwitch.value;
	if (viewSwitch.value) {
		taskItem.value = task;
		taskStore.getTaskItem(task.userId, task.id);
	}
};
</script>

<template>
  <div v-if="item" class="card">
    <h5 class="pb-2">{{ item.title }}</h5>
    <parts-action-btns
      @viewAction="viewCardAcction(item)"
      @updateAction="setUpdateTaskAction()"
      @deleteAction="deleteTaskAction(item)"
    />
    <div v-if="viewSwitch" class="card">
      <div class="card-face">
        <h3 class="card-title">{{ taskItem?.title }}</h3>
        <div class="card-detail">{{ taskItem?.detail }}</div>
      </div>
    </div>
  </div>
</template>
