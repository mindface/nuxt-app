import { defineStore } from "pinia";

export interface TaskConnection {
	id: number;
	title: string;
	body: string;
	created_at: string;
	status: string;
	connectList: TaskConnect[];
}

// connectIdがtaskのIDを利用
export interface TaskConnect {
	id: number;
	connectId: string;
	title: string;
	body: string;
}

const headers = {
	"Content-Type": "application/json",
};

export const useTaskConnectionStore = defineStore("taskConnection", () => {
	const taskConnectionList = ref<TaskConnection[]>([
		{
			id: 0,
			title: "t01",
			body: "b01",
			status: "run",
			created_at: "20230901",
			connectList: [],
		},
	]);

	async function getTaskConnection() {
		const res = await fetch(
			"http://localhost:3003/taskConnect/taskConnectionList",
		);
		const items = await res.json();
		taskConnectionList.value = items ?? [];
	}
	return { taskConnectionList, getTaskConnection };
});
