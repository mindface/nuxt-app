<script setup lang="ts">
import { useTaskEvaluationStore } from "../../store/taskEvaluation";
import type { TaskEvaluation } from "../../types/TaskEvaluation";
import PartsActionBtns from "./../PartsActionBtns.vue";

const taskEvaluationStore = useTaskEvaluationStore();

const viewSwitch = ref(false);

const emit = defineEmits(["updateAction", "setAction"]);

const { item } = defineProps({
	item: {
		type: Object as PropType<TaskEvaluation>,
		default: () => ({}),
	},
});

const taskEvaluationItem = ref<TaskEvaluation | null>();

const setUpdateTaskAction = () => {
	emit("updateAction");
};

const deleteTaskAction = (taskEvaluation: TaskEvaluation) => {
	if (confirm("この操作は取り消せません。削除しますか？")) {
		taskEvaluationStore.deleteTaskEvaluation(taskEvaluation);
	}
};

const viewCardAcction = (taskEvaluation: TaskEvaluation) => {
	viewSwitch.value = !viewSwitch.value;
	if (viewSwitch.value) {
		taskEvaluationItem.value = taskEvaluation;
		// taskStore.getTaskItem(task.userId, task.id);
	}
};
</script>

<template>
  <div v-if="item" class="card">
    <h5 class="pb-2">{{ item.content }}</h5>
    <parts-action-btns
      @viewAction="viewCardAcction(item)"
      @updateAction="setUpdateTaskAction()"
      @deleteAction="deleteTaskAction(item)"
    />
    <div v-if="viewSwitch" class="card">
      <div class="card-face">
        <h3 class="card-title">{{ taskEvaluationItem?.content }}</h3>
        <div class="card-detail">{{ taskEvaluationItem?.impact }}</div>
      </div>
    </div>
  </div>
</template>
