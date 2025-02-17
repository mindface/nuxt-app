import { useAuth } from "../utils/auth";
import { searchTasks } from "../services/taskService";
import { defineEventHandler, getQuery, readBody } from "h3";

export default defineEventHandler(async (event) => {
	await useAuth(event);
	try {
		const method = event.method;
		if (method === "GET") {
			const query = getQuery(event);
			const userId = Number(query.userId);
			const title = String(query.title) ?? "";

			if (!userId) return { status: 400, message: "User ID is required" };

			const tasks = await searchTasks(userId, title);
			return tasks
				? { status: 200, tasks }
				: { status: 401, message: "error search actio" };
		}
	} catch (error) {
		console.error(error);
		return { status: 500, message: "Internal Server Error" };
	}
});
