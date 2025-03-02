import { defineEventHandler, getQuery, readBody } from "h3";
import TaskEvaluationTagService from "../services/taskEvaluationTagService";
import { useAuth } from "../utils/auth";

export default defineEventHandler(async (event) => {
	await useAuth(event);
	try {
		const method = event.method;

		if (method === "GET") {
			const query = getQuery(event);
			const taskEvaluationId = query.taskEvaluationId
				? Number(query.taskEvaluationId)
				: undefined;

			if (!taskEvaluationId) {
				return { status: 400, message: "TaskEvaluationTag ID is required" };
			}

			const tags =
				await TaskEvaluationTagService.getTagsByTaskEvaluationId(
					taskEvaluationId,
				);
			return { status: 200, tags };
		}

		if (method === "POST") {
			const body = await readBody(event);
			const { taskEvaluationId, tagIds } = body;

			if (!taskEvaluationId || !Array.isArray(tagIds) || tagIds.length === 0) {
				return {
					status: 400,
					message: "TaskEvaluationTag ID and tagIds are required",
				};
			}

			const newTags = await TaskEvaluationTagService.addTagsToTaskEvaluation(
				taskEvaluationId,
				tagIds,
			);
			return { status: 201, taskEvaluationTags: newTags };
		}

		if (method === "DELETE") {
			const query = getQuery(event);
			const taskEvaluationId = query.taskEvaluationId
				? Number(query.taskEvaluationId)
				: undefined;
			const tagId = query.tagId ? Number(query.tagId) : undefined;

			if (!taskEvaluationId || !tagId) {
				return {
					status: 400,
					message: "TaskEvaluationTag ID and Tag ID are required for deletion",
				};
			}

			await TaskEvaluationTagService.removeTagFromTaskEvaluation(
				taskEvaluationId,
				tagId,
			);
			return {
				status: 200,
				message: "Tag removed from TaskEvaluationTag successfully",
			};
		}

		return { status: 405, message: "Method Not Allowed" };
	} catch (error) {
		console.error(error);
		return { status: 500, message: "Internal Server Error" };
	}
});
