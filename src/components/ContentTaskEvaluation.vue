<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useAuthStore } from "../store/auth";
import { useTaskStore } from "../store/task";
import { useTaskEvaluationStore } from "../store/taskEvaluation";
import DialogAddTaskEvaluation from "./DialogEvaluationTag.vue";

const content = ref("");
const effect = ref("");
const accuracy = ref(0);
const impact = ref(0);
const taskId = ref(-1);

const taskStore = useTaskStore();
const taskEvaluationStore = useTaskEvaluationStore();
const authStore = useAuthStore();
const { taskList } = storeToRefs(taskStore);
const { taskEvaluationList } = storeToRefs(taskEvaluationStore);
const { authUser } = storeToRefs(authStore);

const addTaskAction = () => {
	if (taskId.value === -1) {
		alert("タスクを選んでください。");
	}
	if (authUser.value?.id) {
		const addTaskEvaluation = {
			content: content.value,
			effect: effect.value,
			userId: authUser.value?.id,
			taskId: taskId.value,
			accuracy: Number(accuracy.value),
			impact: Number(impact.value),
			tags: [],
		};
		taskEvaluationStore.addTaskEvaluation(addTaskEvaluation);
	}
};

const postDataAction = async () => {};

onMounted(async () => {
	if (authUser.value?.id && taskList.value.length === 0) {
		await taskStore.getTaskList(authUser.value?.id);
	}
	if (authUser.value?.id && taskEvaluationList.value.length === 0) {
		await taskEvaluationStore.getTaskEvaluationAllList(authUser.value?.id);
	}
});
</script>

<template>
  <div>
    content task evaluation
    <DialogAddTaskEvaluation />
    <task-evaluation-edit />
    <div class="task-evaluation-list">
      <ul class="list">
        <li v-for="item in taskEvaluationList" class="item">{{ item.content }}</li>
      </ul>
    </div>
  </div>
</template>
