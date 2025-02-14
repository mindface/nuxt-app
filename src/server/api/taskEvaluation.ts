import { useAuth } from "../utils/auth";
import TaskEvaluationsService from "../services/taskEvaluationsService";
import { defineEventHandler, getQuery, readBody } from "h3";

export default defineEventHandler(async (event) => {
	await useAuth(event);
	try {
		const method = event.method;
		if (method === "GET") {
			const query = getQuery(event);
			const taskId = query.taskId ? Number(query.taskId) : undefined;
			const userId = query.userId ? Number(query.userId) : undefined;

			if (userId && !taskId) {
				const taskEvaluations =
					await TaskEvaluationsService.getTaskAllEvaluation(userId);
				return { status: 200, taskEvaluation: taskEvaluations };
			}

			if (taskId) {
				const TaskEvaluation =
					await TaskEvaluationsService.getTaskEvaluationById(taskId);
				return taskId ? TaskEvaluation : { status: 200, TaskEvaluation };
			}
			return { status: 400, message: "TaskEvaluation IDs is required" };
		}

		if (method === "POST") {
			const body = await readBody(event);
			if (!body.userId)
				return { status: 400, message: "TaskEvaluation ID is required" };

			const newTask = await TaskEvaluationsService.createTaskEvaluation(body);
			return { status: 201, taskEvaluation: newTask };
		}

		if (method === "PUT") {
			const body = await readBody(event);
			if (!body.id)
				return {
					status: 400,
					message: "TaskEvaluation ID is required for update",
				};

			const updatedTask = await TaskEvaluationsService.updateTaskEvaluation(
				body.id,
				body,
			);
			return { status: 200, taskEvaluation: updatedTask };
		}

		if (method === "DELETE") {
			const query = getQuery(event);
			if (!query.id)
				return {
					status: 400,
					message: "TaskEvaluation ID is required for deletion",
				};

			await TaskEvaluationsService.deleteTaskEvaluation(Number(query.id));
			return { status: 200, message: "TaskEvaluation deleted successfully" };
		}

		return { status: 405, message: "Method Not Allowed" };
	} catch (error) {
		console.error(error);
		return { status: 500, message: "Internal Server Error" };
	}
});
