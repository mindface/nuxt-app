import { acceptHMRUpdate, defineStore } from "pinia";

export interface Todo {
	id: string;
	title: string;
	body: string;
}

export const useTaskStore = defineStore("task", () => {
	const taskList = ref<Todo[]>([
		{
			id: "id01",
			title: "t01",
			body: "b01",
		},
	]);

	function addTodo(task: Todo) {
		taskList.value = [...taskList.value, task];
	}
	async function getTodo() {
		const res = await fetch("http://localhost:3003/base");
		const items = await res.json();
		taskList.value = items ?? [];
	}
	return { taskList, getTodo, addTodo };
});
