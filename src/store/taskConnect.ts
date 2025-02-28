import { defineStore } from "pinia";
import { ref } from "vue";

// connectIdがtaskのIDを利用
export interface TaskConnect {
	id: number;
	connectId: string;
	title: string;
	body: string;
}
export interface TaskIssue {
	id: number;
	connectId: string;
	title: string;
	body: string;
}

const headers = {
	"Content-Type": "application/json",
};

export const useTaskConnectStore = defineStore("taskConnect", () => {
	const taskConnectLoding = ref(false);
	const taskConnectList = ref<TaskConnect[]>([
		{
			id: 0,
			connectId: "taskId-1",
			title: "t01",
			body: "b01",
		},
	]);
	const taskIssuesList = ref<TaskIssue[]>([
		{
			id: 0,
			connectId: "taskId-1",
			title: "t01",
			body: "b01",
		},
	]);

	async function addTaskConnect(taskConnect: TaskConnect) {
		const addItem = {
			...taskConnect,
			actionType: "add",
		};
		try {
			const res = await fetch("http://localhost:3003/taskConnect/postActions", {
				method: "POST",
				headers: headers,
				body: JSON.stringify(addItem),
			});
			const result = await res.json();
		} catch (error) {
			console.log(`error`, error);
		}
	}
	async function addTaskConnectIssue(taskConnect: TaskConnect) {
		const addItem = {
			...taskConnect,
			actionType: "add",
		};
		try {
			const res = await fetch(
				"http://localhost:3003/taskConnect/taskIssueActions",
				{
					method: "POST",
					headers: headers,
					body: JSON.stringify(addItem),
				},
			);
			const result = await res.json();
		} catch (error) {
			console.log(`error`, error);
		}
	}
	async function updateTaskConnect(taskConnect: TaskConnect) {
		const addItem = {
			...taskConnect,
			actionType: "update",
		};
		try {
			const res = await fetch("http://localhost:3003/taskConnect/postActions", {
				method: "POST",
				headers: headers,
				body: JSON.stringify(addItem),
			});
			const result = await res.json();
		} catch (error) {
			console.log(`error`, error);
		}
	}
	async function deleteTaskConnect(taskConnect: TaskConnect) {
		const addItem = {
			id: taskConnect.id,
			actionType: "delete",
		};
		try {
			const res = await fetch("http://localhost:3003/taskConnect/postActions", {
				method: "POST",
				headers: headers,
				body: JSON.stringify(addItem),
			});
			const result = await res.json();
		} catch (error) {
			console.log(`error`, error);
		}
	}
	async function getTaskConnect() {
		const res = await fetch("http://localhost:3003/base");
		const items = await res.json();
		taskConnectList.value = items ?? [];
	}
	async function getTaskConnectList() {
		const res = await fetch(
			"http://localhost:3003/taskConnect/taskConnectList",
		);
		const items = await res.json();
		taskConnectList.value = items ?? [];
	}
	async function getTaskIssueList() {
		const res = await fetch("http://localhost:3003/taskConnect/taskissueList");
		const items = await res.json();
		taskIssuesList.value = items ?? [];
	}

	return {
		taskConnectLoding,
		taskConnectList,
		taskIssuesList,
		getTaskConnect,
		getTaskConnectList,
		getTaskIssueList,
		addTaskConnect,
		addTaskConnectIssue,
		updateTaskConnect,
		deleteTaskConnect,
	};
});
