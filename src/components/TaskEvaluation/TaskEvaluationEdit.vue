<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useAuthStore } from "../../store/auth";
import { useTaskStore } from "../../store/task";
import { useTaskEvaluationStore } from "../../store/taskEvaluation";
import type { AddTask, Task } from "../../types/Task";

const title = ref("");
const detail = ref("");
const evaluationFactor = ref(1);
const updateItem = ref<Task>();
const editType = ref("new");
const editSwitch = ref(false);

const content = ref("");
const effect = ref("");
const accuracy = ref(0);
const impact = ref(0);
const taskId = ref(-1);

const taskEvaluationStore = useTaskEvaluationStore();
const taskStore = useTaskStore();
const authStore = useAuthStore();
const { taskEvaluationList } = storeToRefs(taskEvaluationStore);
const { authUser }= storeToRefs(authStore);
const { taskList } = storeToRefs(taskStore);

const setTaskList = () => {
	setTimeout(() => {
		// taskStore.getTaskList(authUser.value?.id ?? 0);
	}, 800);
};

const addTaskAction = () => {
	if (authUser.value?.id) {
		const item: AddTask = {
			title: title.value,
			detail: detail.value,
			evaluationFactor: Number(evaluationFactor.value),
			userId: authUser.value?.id,
		};
		// taskStore.addTask(item);
		setTaskList();
	}
};

const setTaskAction = () => {
	title.value = "";
	detail.value = "";
	evaluationFactor.value = 1;
	editType.value = "new";
};

const updateTaskAction = () => {
	if (authUser.value?.id && updateItem.value) {
		const setUpdateItem: Task = {
			...updateItem.value,
			title: title.value,
			detail: detail.value,
			evaluationFactor: Number(evaluationFactor.value),
			userId: authUser.value?.id,
		};
		// taskStore.updateTask(setUpdateItem);
		setTaskList();
	}
};

const setUpdateTaskAction = (task: Task) => {
	console.log(task);
	updateItem.value = task;
	title.value = task.title;
	detail.value = task.detail ?? "";
	evaluationFactor.value = task.evaluationFactor;
	editType.value = "update";
};

onMounted(() => {
	// taskStore.getTaskList(authUser.value?.id ?? 0);
});
</script>

<template>
  <div>
    <div :class="editSwitch ? 
        'add-task-box max-w-xs max-h-[calc(100vh-56px)] fixed overflow-y-auto bottom-0 right-0 p-2 bg-white shadow z-10' :
        'add-task-box max-w-xs max-h-[calc(100vh-56px)] fixed overflow-y-auto bottom-0 left-0 p-2 bg-white shadow z-10'
      ">
      <div class="pb-2">
        <button
          class="bg-sky-300 font-semibold text-white py-2 px-4 rounded"
          @click="editSwitch = !editSwitch"
        >position change</button>
      </div>
      <div v-if="editType === 'update'" class="field">
        <p>
          <button
            class="bg-sky-300 font-semibold text-white py-2 px-4 rounded"
            @click="setTaskAction"
          >new create</button>
        </p>
      </div>
      <div class="field">
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
        <p v-if="editType === 'new'">
          <button 
            class="bg-sky-300 font-semibold text-white py-2 px-4 rounded"
            @click="addTaskAction"
          >add</button>
        </p>
        <p v-if="editType === 'update'">
          <button
            class="bg-sky-300 font-semibold text-white py-2 px-4 rounded"
            @click="updateTaskAction"
          >update</button>
        </p>
      </div>
    </div>
    <div class="task-box flex flex-wrap p-2">
      <div
        v-for="item in taskEvaluationList"
        :key="item.id"
        class="item mb-2 mr-2 p-1 max-w-xs w-full shadow sticky"
      >
       <!-- <content-task-card
         :item="item"
         @updateAction="setUpdateTaskAction(item)"
         @setAction="setTaskList()"
       /> -->
      </div>
    </div>
  </div>
</template>
