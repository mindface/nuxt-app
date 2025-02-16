import { defineStore } from "pinia";
import type {
	AddTaskEvaluation,
	UpdateTaskEvaluation,
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
				console.log(data);
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
			const data = await $fetch<TaskEvaluationResponse>(
				"/api/taskEvaluation?selectTags=${selectTags}",
				{
					method: "POST",
					headers: headers,
					body: JSON.stringify(addTaskEvaluation),
				},
			);
			return { message: "success" };
		} catch (error) {
			console.error(`error`, error);
		}
	}
	async function updateTaskEvaluation(taskEvaluation: UpdateTaskEvaluation) {
		try {
			const data = await $fetch<TaskEvaluationResponse>("/api/taskEvaluation", {
				method: "PUT",
				headers: headers,
				body: JSON.stringify(taskEvaluation),
			});
			console.log(data);
			return { message: "success" };
		} catch (error) {
			console.error(`error`, error);
		}
	}
	async function deleteTaskEvaluation(taskEvaluation: TaskEvaluation) {
		try {
			const data = await useFetch<TaskEvaluationResponse>(
				`/api/taskEvaluation/${taskEvaluation.id}`,
				{
					method: "DELETE",
				},
			);
			return { message: "success" };
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
