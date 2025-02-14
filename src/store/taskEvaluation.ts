import { defineStore } from "pinia";
import type {
	AddTaskEvaluation,
	TaskEvaluation,
} from "../types/TaskEvaluation";
import type { TaskEvaluationResponse } from "../types/ApiRespose";

export const useTaskEvaluationStore = defineStore("TaskEvaluation", () => {
	const taskEvaluationList = ref<TaskEvaluation[]>([]);
	const headers = {
		"Content-Type": "application/json",
		Authorization: `Bearer ${useCookie("auth_token").value}`,
	};

	async function getTaskEvaluationAllList(userId: number) {
		try {
			const data = await $fetch<TaskEvaluationResponse>(
				`/api/taskEvaluation?userId=${userId}`,
				{
					method: "GET",
					headers: headers,
				},
			);
			if (data) {
				taskEvaluationList.value = data.taskEvaluation ?? [];
			}
		} catch (error) {
			console.error(error);
		}
	}

	async function getTaskEvaluationList(taskId: number) {
		try {
			const data = await $fetch<TaskEvaluationResponse>(
				`/api/taskEvaluation?id=${taskId}`,
				{
					method: "GET",
					headers: headers,
				},
			);
			if (data) {
				taskEvaluationList.value = data.taskEvaluation ?? [];
			}
		} catch (error) {
			console.error(error);
		}
	}
	async function addTaskEvaluation(addTaskEvaluation: AddTaskEvaluation) {
		try {
			const data = await $fetch<TaskEvaluationResponse>("/api/taskEvaluation", {
				method: "POST",
				headers: headers,
				body: JSON.stringify(addTaskEvaluation),
			});
			console.log(data);
		} catch (error) {
			console.error(`error`, error);
		}
	}
	async function updateTaskEvaluation(task: TaskEvaluation) {
		try {
			const data = await $fetch<TaskEvaluationResponse>("/api/taskEvaluation", {
				method: "PUT",
				headers: headers,
				body: JSON.stringify(task),
			});
		} catch (error) {
			console.error(`error`, error);
		}
	}
	async function deleteTaskEvaluation(task: TaskEvaluation) {
		try {
			const data = await useFetch<TaskEvaluationResponse>(
				`/api/taskEvaluation/${task.id}`,
				{
					method: "DELETE",
				},
			);
		} catch (error) {
			console.error(`error`, error);
		}
	}

	return {
		taskEvaluationList,
		addTaskEvaluation,
		updateTaskEvaluation,
		deleteTaskEvaluation,
		getTaskEvaluationList,
		getTaskEvaluationAllList,
	};
});
