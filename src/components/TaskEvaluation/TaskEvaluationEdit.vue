<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useAuthStore } from "../../store/auth";
import { useTaskStore } from "../../store/task";
import { useTaskEvaluationStore } from "../../store/taskEvaluation";
import { useEvaluationTagStore } from "../../store/evaluationTag";
import type {
	TaskEvaluation,
	UpdateTaskEvaluation,
} from "../../types/TaskEvaluation";
import type { EvaluationTag } from "../../types/EvaluationTag";

const editType = ref("new");
const editSwitch = ref(false);
const updateItem = ref<TaskEvaluation>();

const content = ref("");
const effect = ref("");
const accuracy = ref(0);
const impact = ref(0);
const taskId = ref(-1);
const selectTags = ref<string[]>([]);

const taskStore = useTaskStore();
const authStore = useAuthStore();
const taskEvaluationStore = useTaskEvaluationStore();
const evaluationTagStore = useEvaluationTagStore();
const { taskEvaluationList } = storeToRefs(taskEvaluationStore);
const { authUser } = storeToRefs(authStore);
const { taskList } = storeToRefs(taskStore);
const { tagList } = storeToRefs(evaluationTagStore);

const setTaskList = () => {
	taskEvaluationStore.getTaskEvaluationAllList(authUser.value?.id ?? 0);
};

const addTaskAction = async () => {
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
			tagIds: tagList.value
				.filter((tag) => selectTags.value.includes(tag.label))
				.map((tag) => tag.id),
		};
		const res = await taskEvaluationStore.addTaskEvaluation(addTaskEvaluation);
		if (res?.message === "success") {
			setTaskList();
		}
	}
};

const setTaskAction = () => {
	content.value = "";
	effect.value = "";
	editType.value = "new";
	accuracy.value = 0;
	impact.value = 0;
	selectTags.value = [];
};

const updateTaskAction = () => {
	if (authUser.value?.id && updateItem.value) {
		const setUpdateItem: UpdateTaskEvaluation = {
			...updateItem.value,
			content: content.value,
			effect: effect.value,
			accuracy: Number(accuracy.value),
			impact: Number(impact.value),
			tagIds: tagList.value
				.filter((tag) => selectTags.value.includes(tag.label))
				.map((tag) => tag.id),
		};
		taskEvaluationStore.updateTaskEvaluation(setUpdateItem);
		setTaskList();
	}
};

const setUpdateTaskAction = (taskEvaluation: TaskEvaluation) => {
	updateItem.value = taskEvaluation;
	content.value = taskEvaluation.content;
	effect.value = taskEvaluation.effect ?? "";
	accuracy.value = taskEvaluation.accuracy;
	impact.value = taskEvaluation.impact;
	editType.value = "update";
	console.log(taskEvaluation);
	selectTags.value = taskEvaluation.tags
		.map((tag) => tagList.value.find((item) => item.id === tag.tagId)?.label)
		.filter((label) => typeof label === "string");
};

const selectTagAction = (evaluationTag: EvaluationTag) => {
	if (!selectTags.value.includes(evaluationTag.label)) {
		selectTags.value.push(evaluationTag.label);
	} else {
		selectTags.value = selectTags.value.filter(
			(item) => item !== evaluationTag.label,
		);
	}
};

onMounted(async () => {
	if (authUser.value?.id && taskList.value.length === 0) {
		await taskStore.getTaskList(authUser.value?.id);
	}
	if (authUser.value?.id && taskEvaluationList.value.length === 0) {
		await taskEvaluationStore.getTaskEvaluationAllList(authUser.value?.id);
	}
	evaluationTagStore.getEvaluationTagList();
});
</script>

<template>
  <div>
    <div
      :class="editSwitch ? 
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
            <div class="p-2">
              <div class="select-tag">
                <span
                  class="inline-block mr-2 p-2 border"
                  v-for="item in tagList"
                  @click="selectTagAction(item)"
                >{{ item.label }}</span>
              </div>
              <div class="selected-tag">
                <div class="pt-4 pb-4">{{ $t("selectedTag") }}</div>
                <span class="inline-block mr-2 p-2 border" v-for="item in selectTags">{{ item }}</span>
              </div>
            </div>
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
        <task-evaluation-card
          :item="item"
          @updateAction="setUpdateTaskAction(item)"
        />
      </div>
    </div>
  </div>
</template>
