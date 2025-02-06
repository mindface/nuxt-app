<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useAuthStore } from "../store/auth";
import { useTaskStore } from "../store/task";
import type { AddTask, Task } from "../types/Task";
import PartsActionBtns from "./PartsActionBtns.vue";
import PartsTaskForm from "./PartsTaskForm.vue";

const title = ref("");
const detail = ref("");
const evaluationFactor = ref(1);
const updateItem = ref<Task>();
const editType = ref("new");
const editSwitch = ref(false);

const taskStore = useTaskStore();
const authStore = useAuthStore();
const { taskList } = storeToRefs(taskStore);
const { authUser } = storeToRefs(authStore);

const props = defineProps({
	item: {
		type: Object as PropType<Task>,
		default: () => ({}),
	},
	editType: {
		type: String,
		default: "new",
	},
});

const setTaskList = () => {
	setTimeout(() => {
		taskStore.getTaskList(authUser.value?.id ?? 0);
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
		taskStore.addTask(item);
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
		taskStore.updateTask(setUpdateItem);
		setTaskList();
	}
};

const setUpdateTaskAction = (task: Task) => {
	updateItem.value = task;
	title.value = task.title;
	detail.value = task.detail ?? "";
	evaluationFactor.value = task.evaluationFactor;
	editType.value = "update";
};

const deleteTaskAction = (task: Task) => {
	if (confirm("この操作は取り消せません。削除しますか？")) {
		taskStore.deleteTask(task);
		setTaskList();
	}
};

onMounted(() => {
	taskStore.getTaskList(authUser.value?.id ?? 0);
});
</script>

<template>
  <div>
    <div :class="editSwitch ? 
        'add-task-box max-w-xs fixed bottom-0 right-0 p-2 bg-white shadow z-10' :
        'add-task-box max-w-xs fixed bottom-0 left-0 p-2 bg-white shadow z-10'
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
        <parts-task-form
          :title="title"
          :detail="detail"
          :evaluationFactor="evaluationFactor"
          @changeTitleAction="(value) => {
            title = value
          }"
          @changeBodyAction="(value) => {
            detail = value
          }"
          @changeEvaluationFactorAction="(value) => {
            evaluationFactor = value
          }"
        />
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
        v-for="item in taskList"
        :key="item.id"
        class="item mb-2 mr-2 p-1 max-w-xs w-full shadow sticky"
      >
       <h5 class="pb-2">{{ item.title }}</h5>
       <parts-action-btns
         @viewAction="() => {}"
         @updateAction="setUpdateTaskAction(item)"
         @deleteAction="deleteTaskAction(item)"
       />
      </div>
    </div>
  </div>
</template>
