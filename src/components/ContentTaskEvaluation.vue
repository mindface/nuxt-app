<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useAuthStore } from "../store/auth";
import { useTaskStore } from "../store/task";
import { useTaskEvaluationStore } from "../store/taskEvaluation";
import DialogAddTaskEvaluation from "./DialogAddTaskEvaluation.vue";
import { NumberController } from "three/examples/jsm/libs/lil-gui.module.min.js";

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
    <div class="add-task-evaluation-box max-w-xs">
      <div class="field">
        <select v-model="taskId">
          <option
            v-for="item in taskList"
            :value="item.id"
          >{{ item.title }}</option>
        </select>
      </div>
      <div class="field">
        <label class="label block text-gray-700 text-sm font-bold mb-2">content</label>
        <div class="p-2">
          <textarea
            v-model="content"
            cols="30"
            rows="10"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          ></textarea>
        </div>
        <div class="p-2">
          <label class="label block text-gray-700 text-sm font-bold mb-2">effect</label>
          <textarea
            v-model="effect"
            cols="30"
            rows="10"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          ></textarea>
        </div>
        <div class="p-2">
          <div class="mb-2">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="accuracy">
              accuracy
            </label>
            <input
              type="range"
              v-model="accuracy"
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            {{ accuracy }}
          </div>
          <div class="mb-2">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="impact">
              impact
            </label>
            <input
              type="range"
              v-model="impact"
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            {{ impact }}
          </div>
        </div>
        <p><button @click="addTaskAction">add</button></p>
      </div>
    </div>
    <div class="task-evaluation-list">
      <ul class="list">
        <li v-for="item in taskEvaluationList" class="item">{{ item.content }}</li>
      </ul>
    </div>
  </div>
</template>
