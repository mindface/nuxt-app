import { defineStore } from "pinia";
import type { AddTask, Task } from "../types/Task";

export const useTaskStore = defineStore("task", () => {
	const taskList = ref<Task[]>([]);
	const taskItem = ref<Task>();
	const headers = {
		"Content-Type": "application/json",
		Authorization: `Bearer ${useCookie("auth_token").value}`,
	};

	async function getTaskItem(userId: number, taskId?: number) {
		try {
			const res: Task = await $fetch(
				`/api/task?userId=${userId}&id=${taskId}`,
				{
					method: "GET",
					headers: headers,
				},
			);
			if (res) {
				taskItem.value = res as Task;
			}
		} catch (error) {
			console.error(error);
		}
	}
	async function getTaskList(userId: number) {
		try {
			const items: Task[] = await $fetch(`/api/task?userId=${userId}`, {
				method: "GET",
				headers: headers,
			});
			taskList.value = items ?? [];
		} catch (error) {
			console.error(error);
		}
	}
	async function addTask(addTask: AddTask) {
		try {
			const res = await $fetch("/api/task", {
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
			const res = await $fetch("/api/task", {
				method: "PUT",
				headers: headers,
				body: JSON.stringify(task),
			});
			console.error(res);
		} catch (error) {
			console.error(`error`, error);
		}
	}
	async function deleteTask(task: Task) {
		try {
			const res = await $fetch(`/api/task/${task.id}`, {
				method: "DELETE",
			});
			console.error(res);
		} catch (error) {
			console.error(`error`, error);
		}
	}

	return {
		taskItem,
		taskList,
		getTaskItem,
		addTask,
		updateTask,
		deleteTask,
		getTaskList,
	};
});
