import { defineStore } from "pinia";
import type { AddTask, Task } from "../types/Task";
import type { TasksResponse } from "../types/ApiRespose";

export const useTaskStore = defineStore("task", () => {
	const taskList = ref<Task[]>([]);
	const taskItem = ref<Task>();
	const headers = {
		"Content-Type": "application/json",
		Authorization: `Bearer ${useCookie("auth_token").value}`,
	};

	const setTasks = (tasks: Task[]) => {
		taskList.value = tasks;
	};

	async function getTaskSearch(userId: number, text: string) {
		try {
			const data = await $fetch<TasksResponse>(
				`/api/taskSearch?userId=${userId}&title=${text}`,
				{
					method: "GET",
					headers: headers,
				},
			);
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
			const data = await $fetch<TasksResponse>(
				`/api/task?userId=${userId}&id=${taskId}`,
				{
					method: "GET",
					headers: headers,
				},
			);
			if (data) {
				taskItem.value = data?.tasks[0];
			}
		} catch (error) {
			console.error(error);
		}
	}
	async function getTaskList(userId: number) {
		try {
			const data = await $fetch<TasksResponse>(`/api/task?userId=${userId}`, {
				method: "GET",
				headers: headers,
			});
			if (data) {
				taskList.value = data.tasks ?? [];
			}
		} catch (error) {
			console.error(error);
		}
	}
	async function addTask(addTask: AddTask) {
		try {
			const data = await $fetch<TasksResponse>("/api/task", {
				method: "POST",
				headers: headers,
				body: JSON.stringify(addTask),
			});
		} catch (error) {
			console.error(`error`, error);
		}
	}
	async function updateTask(task: Task) {
		try {
			const data = await $fetch<TasksResponse>("/api/task", {
				method: "PUT",
				headers: headers,
				body: JSON.stringify(task),
			});
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
