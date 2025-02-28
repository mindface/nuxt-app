import { defineStore } from "pinia";
import type { TasksResponse } from "../types/ApiRespose";
import type { AddTask, Task } from "../types/Task";
import { headersTypeJson } from "../utils/headers-helper";

export const useTaskStore = defineStore("task", () => {
	const taskList = ref<Task[]>([]);
	const taskItem = ref<Task>();

	const setTasks = (tasks: Task[]) => {
		taskList.value = tasks;
	};

	async function getTaskSearch(userId: number, text: string) {
		try {
			const data = (await $fetch(
				`/api/taskSearch?userId=${userId}&title=${text}`,
				{
					method: "GET",
					headers: headersTypeJson(),
				},
			)) as TasksResponse;
			if (data) {
				console.log(data);
				taskList.value = data?.tasks;
			}
		} catch (error) {
			console.error(error);
		}
	}

	async function getTaskItem(userId: number, taskId?: number) {
		try {
			const data = (await $fetch(`/api/task?userId=${userId}&id=${taskId}`, {
				method: "GET",
				headers: headersTypeJson(),
			})) as TasksResponse;
			if (data) {
				taskItem.value = data?.tasks[0];
			}
		} catch (error) {
			console.error(error);
		}
	}
	async function getTaskList(userId: number) {
		try {
			const data = (await $fetch(`/api/task?userId=${userId}`, {
				method: "GET",
				headers: headersTypeJson(),
			})) as TasksResponse;
			if (data) {
				taskList.value = data.tasks ?? [];
			}
		} catch (error) {
			console.error(error);
		}
	}
	async function addTask(addTask: AddTask) {
		try {
			const data = (await $fetch("/api/task", {
				method: "POST",
				headers: headersTypeJson(),
				body: JSON.stringify(addTask),
			})) as TasksResponse;
		} catch (error) {
			console.error(`error`, error);
		}
	}
	async function updateTask(task: Task) {
		try {
			const data = (await $fetch("/api/task", {
				method: "PUT",
				headers: headersTypeJson(),
				body: JSON.stringify(task),
			})) as TasksResponse;
		} catch (error) {
			console.error(`error`, error);
		}
	}
	async function deleteTask(task: Task) {
		try {
			const data = await useFetch<TasksResponse>(`/api/task/${task.id}`, {
				method: "DELETE",
			});
		} catch (error) {
			console.error(`error`, error);
		}
	}

	return {
		taskItem,
		taskList,
		setTasks,
		getTaskItem,
		getTaskSearch,
		addTask,
		updateTask,
		deleteTask,
		getTaskList,
	};
});
