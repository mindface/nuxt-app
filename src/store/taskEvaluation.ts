import { useCookie, useFetch } from "nuxt/app";
import { defineStore } from "pinia";
import { ref } from "vue";
import type { TaskEvaluationResponse } from "../types/ApiRespose";
import type {
	AddTaskEvaluation,
	TaskEvaluation,
	UpdateTaskEvaluation,
} from "../types/TaskEvaluation";

export const useTaskEvaluationStore = defineStore("taskEvaluation", () => {
	const taskEvaluationList = ref<TaskEvaluation[]>([]);
	const headers = {
		"Content-Type": "application/json",
		Authorization: `Bearer ${useCookie("auth_token").value}`,
	};

	async function getTaskEvaluationAllList(userId: number) {
		try {
			const data = (await $fetch(`/api/taskEvaluation?userId=${userId}`, {
				method: "GET",
				headers: headers,
			})) as TaskEvaluationResponse;
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
			const data = (await $fetch(`/api/taskEvaluation?id=${taskId}`, {
				method: "GET",
				headers: headers,
			})) as TaskEvaluationResponse;
			if (data) {
				taskEvaluationList.value = data.taskEvaluation ?? [];
			}
		} catch (error) {
			console.error(error);
		}
	}
	async function addTaskEvaluation(addTaskEvaluation: AddTaskEvaluation) {
		try {
			const data = (await $fetch(
				"/api/taskEvaluation?selectTags=${selectTags}",
				{
					method: "POST",
					headers: headers,
					body: JSON.stringify(addTaskEvaluation),
				},
			)) as TaskEvaluationResponse;
			return { message: "success" };
		} catch (error) {
			console.error(`error`, error);
		}
	}
	async function updateTaskEvaluation(taskEvaluation: UpdateTaskEvaluation) {
		try {
			const data = (await $fetch("/api/taskEvaluation", {
				method: "PUT",
				headers: headers,
				body: JSON.stringify(taskEvaluation),
			})) as TaskEvaluationResponse;
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
