<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useTaskStore } from "../store/task";
import { useTaskConnectStore } from "../store/taskConnect";
import type { TaskConnect } from "../store/taskConnect";
import PartsActionBtns from "./PartsActionBtns.vue";
import PartsTaskForm from "./PartsTaskForm.vue";

const taskStore = useTaskStore();
const { taskList } = storeToRefs(taskStore);
const taskConnectStore = useTaskConnectStore();
const { taskConnectList, taskIssuesList } = storeToRefs(taskConnectStore);

const title = ref("");
const body = ref("");
const issueTitle = ref("");
const issueBody = ref("");
const updateItem = ref<TaskConnect>();
const editType = ref("new");
const connectId = ref(-1);
const issueSwitcher = ref(false);

const setTaskConnectList = () => {
	setTimeout(() => {
		taskConnectStore.getTaskConnectList();
	}, 800);
};

const addTaskConnectAction = () => {
	const item = {
		id: taskConnectList.value.length + 1,
		connectId: `taskId-${connectId.value}`,
		title: title.value,
		body: body.value,
	};
	taskConnectStore.addTaskConnect(item);
	setTaskConnectList();
};

const addTaskIssueAction = () => {
	const item = {
		id: 0,
		connectId: "taskId-0",
		title: issueTitle.value,
		body: issueBody.value,
	};
	taskConnectStore.addTaskConnectIssue(item);
	setTaskConnectList();
};

const updateTaskConnectAction = () => {
	const item = {
		id: updateItem.value?.id ?? 0,
		connectId: `taskId-${connectId.value}`,
		title: title.value,
		body: body.value,
	};
	taskConnectStore.updateTaskConnect(item);
	setTaskConnectList();
};

const setUpdateTaskAction = (taskConnect: TaskConnect) => {
	const id = taskConnect.connectId.split("-")[1];
	title.value = taskConnect.title;
	body.value = taskConnect.body;
	connectId.value = Number(id);
	editType.value = "update";
	updateItem.value = taskConnect;
};

const setTaskConnectAction = () => {
	title.value = "";
	body.value = "";
	connectId.value = -1;
	editType.value = "new";
};

const deleteTaskConnectAction = (taskConnect: TaskConnect) => {
	if (confirm("この操作は取り消せません。削除しますか？")) {
		taskConnectStore.deleteTaskConnect(taskConnect);
		setTaskConnectList();
	}
};

onMounted(() => {
	// taskStore.getTaskList()
	// taskConnectStore.getTaskIssueList()
});
</script>

<template>
  <div>
    content task connect
    <div class="add-task-box flex">
      <div class="field">
        <h4 class="title">task connect</h4>
        <div class="p-2">
          <div
            v-if="editType === 'update'"
            class="mb-4"
          >
            <button
              class="bg-
              sky-300 font-semibold text-white py-2 px-4 rounded"
              @click="setTaskConnectAction"
            >新規追加</button>
          </div>
          <div class="mb-4">
            <p>つなぐタスクの補助 {{ connectId }}</p>
            <select v-model="connectId">
              <option v-for="item in taskList" :value="item.id">{{ item.title }}</option>
            </select>
          </div>
          <parts-task-form
            :title="title"
            :body="body"
            @changeTitleAction="(value:string) => {
              title = value
            }"
            @changeBodyAction="(value:string) => {
              body = value
            }"
          />
        </div>
        <div class="p-2">
          <button
            v-if="editType === 'new'"
            class="bg-sky-300 font-semibold text-white py-2 px-4 rounded"
            @click="addTaskConnectAction"
          >add</button>
          <button
            v-if="editType === 'update'"
            class="bg-sky-300 font-semibold text-white py-2 px-4 rounded"
            @click="updateTaskConnectAction"
          >update</button>
        </div>
      </div>
      <div class="field">
        <h4 class="title">issue</h4>
        <parts-task-form
          :title="issueTitle"
          :body="issueBody"
          @changeTitleAction="(value:string) => {
            issueTitle = value
          }"
          @changeBodyAction="(value:string) => {
            issueBody = value
          }"
        />
        <div class="p-2">
          <button
            class="bg-sky-300 font-semibold text-white py-2 px-4 rounded"
            @click="addTaskIssueAction"
          >add</button>
        </div>
      </div>
    </div>
    <div 
      :class="issueSwitcher ?
        'task-issue-box active fixed top-0 right-0 flex flex-wrap p-2 bg-white z-10' :
        'task-issue-box fixed top-0 right-0 flex flex-wrap p-2 bg-white z-10'
      "
    >
      <div class="view-btn absolute top-16 -left-16 z-10">
        <button
          class="bg-sky-300 font-semibold text-white py-2 px-4 rounded"
          @click="issueSwitcher = !issueSwitcher"
        >view</button>
      </div>
      <div
        v-for="item in taskIssuesList"
        :key="item.id"
        class="item mb-2 mr-2 p-1 max-w-xs w-full shadow relative group"
      >
        <h5 class="pb-2">{{ item.title }}</h5>
        <div class="body">{{ item.body }}</div>
      </div>
    </div>
    <div class="task-box flex flex-wrap p-2">
      <div
        v-for="item in taskConnectList"
        :key="item.id"
        class="item mb-2 mr-2 p-1 max-w-xs w-full shadow relative group"
      >
       <h5 class="pb-2">{{ item.title }}</h5>
       <div class="body">{{ item.body }}</div>
       <div class="actions flex opacity-0 w-[240px] invisible rounded text-[12px] 
          font-bold text-white p-2 top-4 left-3
          group-hover:visible opacity-100 absolute z-10">
          <parts-action-btns
            @viewAction="() => {}"
            @updateAction="setUpdateTaskAction(item)"
            @deleteAction="deleteTaskConnectAction(item)"
          />
       </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.task-issue-box {
  max-width: calc(100% - 80px);
  transform: translate(100%,0);
}
.task-issue-box.active {
  transform: translate(0,0);
}
</style>