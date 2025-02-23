import { useAuth } from "../utils/auth";
import {
	getTasks,
	createTask,
	updateTask,
	deleteTask,
} from "../services/taskService";
import { defineEventHandler, getQuery, readBody } from "h3";

export default defineEventHandler(async (event) => {
	await useAuth(event);
	try {
		const method = event.method;
		if (method === "GET") {
			const query = getQuery(event);
			const userId = Number(query.userId);
			const taskId = query.id ? Number(query.id) : undefined;

			if (!userId) return { status: 400, message: "User ID is required" };

			const tasks = await getTasks(userId, taskId);
			return taskId ? tasks : { status: 200, tasks };
		}

		if (method === "POST") {
			const body = await readBody(event);
			if (!body.userId) return { status: 400, message: "User ID is required" };

			const newTask = await createTask(body);
			return { status: 201, task: newTask };
		}

		if (method === "PUT") {
			const body = await readBody(event);
			if (!body.id)
				return { status: 400, message: "Task ID is required for update" };

			const updatedTask = await updateTask(body.id, body);
			return { status: 200, task: updatedTask };
		}

		if (method === "DELETE") {
			const query = getQuery(event);
			if (!query.id)
				return { status: 400, message: "Task ID is required for deletion" };

			await deleteTask(Number(query.id));
			return { status: 200, message: "Task deleted successfully" };
		}

		return { status: 405, message: "Method Not Allowed" };
	} catch (error) {
		console.error(error);
		return { status: 500, message: "Internal Server Error" };
	}
});
