<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useAuthStore } from "../store/auth";
import { useTaskStore } from "../store/task";
import type { AddTask, Task } from "../types/Task";

import PartsTaskForm from "./PartsTaskForm.vue";
import BlockSearch from "./BlockSearch.vue";

const title = ref("");
const detail = ref("");
const evaluationFactor = ref(1);
const updateItem = ref<Task>();
const editType = ref("new");
const editSwitch = ref(false);

const sentForm = ref<HTMLFormElement>();

const taskStore = useTaskStore();
const authStore = useAuthStore();
const { taskList } = storeToRefs(taskStore);
const { authUser } = storeToRefs(authStore);

// 今後使う予定
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

const taskSendAction = (e: Event) => {
	// テストの関係で他のフォームと異なった形式にしている。
	e.preventDefault();
	const formData = new FormData(sentForm.value);
	const title = (formData.get("title") as string) ?? "";
	const detail = (formData.get("detail") as string) ?? "";
	const evaluationFactor = Number(formData.get("evaluationFactor")) ?? "";
	if (authUser.value?.id && editType.value === "new") {
		const item: AddTask = {
			title: title,
			detail: detail,
			evaluationFactor: evaluationFactor,
			userId: authUser.value?.id,
		};
		taskStore.addTask(item);
		setTaskList();
	}
	if (authUser.value?.id && updateItem.value && editType.value === "update") {
		const setUpdateItem: Task = {
			...updateItem.value,
			title: title,
			detail: detail,
			evaluationFactor: evaluationFactor,
			userId: authUser.value?.id,
		};
		taskStore.updateTask(setUpdateItem);
		setTaskList();
	}
};

const setTaskAction = () => {
	title.value = "";
	detail.value = "";
	evaluationFactor.value = 1;
	editType.value = "new";
};

const setUpdateTaskAction = (task: Task) => {
	updateItem.value = task;
	title.value = task.title;
	detail.value = task.detail ?? "";
	evaluationFactor.value = task.evaluationFactor;
	editType.value = "update";
};

onMounted(() => {
	taskStore.getTaskList(authUser.value?.id ?? 0);
});
</script>

<template>
  <div>
    <div :class="editSwitch ? 
        'add-task-box max-w-xs fixed bottom-0 right-0 p-2 bg-white shadow z-10 parts-task-field' :
        'add-task-box max-w-xs fixed bottom-0 left-0 p-2 bg-white shadow z-10 parts-task-field'
      ">
      <div class="pb-2">
        <button
          class="bg-sky-300 font-semibold text-white py-2 px-4 rounded parts-task-field"
          @click="editSwitch = !editSwitch"
        >position change</button>
      </div>
      <div v-if="editType === 'update'" class="field parts-task-field">
        <p>
          <button
            class="bg-sky-300 font-semibold text-white py-2 px-4 rounded"
            @click="setTaskAction"
          >new create</button>
        </p>
      </div>
      <div class="field parts-task-form-field">
        <form ref="sentForm" @submit.prevent="taskSendAction">
          <parts-task-form
            :title="title"
            :body="detail"
            :evaluationFactor="evaluationFactor"
            @changeTitleAction="(value: string) => {
              title = value
            }"
            @changeBodyAction="(value: string) => {
              detail = value
            }"
            @changeEvaluationFactorAction="(value: string) => {
              evaluationFactor = Number(value)
            }"
          />
          <p v-if="editType === 'new'">
            <button
              type="submit"
              class="btn bg-sky-300 font-semibold text-white py-2 px-4 rounded"
            >add</button>
          </p>
          <p v-if="editType === 'update'">
            <button
              type="submit"
              class="btn bg-sky-300 font-semibold text-white py-2 px-4 rounded"
            >update</button>
          </p>
        </form>
      </div>
    </div>
    <div class="task-search-box p-4">
      <block-search type="task" />
    </div>
    <div class="task-box flex flex-wrap p-2">
      <div
        v-for="item in taskList"
        :key="item.id"
        class="item mb-2 mr-2 p-1 max-w-xs w-full shadow"
      >
       <content-task-card
         :item="item"
         @updateAction="setUpdateTaskAction(item)"
         @setAction="setTaskList()"
       />
      </div>
    </div>
  </div>
</template>
