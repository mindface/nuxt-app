import { useAuth } from "../utils/auth";
import EvaluationTagService from "../services/evaluationTagService";
import { defineEventHandler, getQuery, readBody } from "h3";

export default defineEventHandler(async (event) => {
	await useAuth(event);
	try {
		const method = event.method;

		if (method === "GET") {
			const tags = await EvaluationTagService.getAllTags();
			return { status: 200, tags };
		}

		if (method === "POST") {
			const body = await readBody(event);
			const { key, industry, label } = body;

			if (!key || !industry || !label) {
				return {
					status: 400,
					message: "Key, industry, and label are required",
				};
			}

			const newTag = await EvaluationTagService.createTag(body);
			return { status: 201, tag: newTag };
		}

		if (method === "PUT") {
			const body = await readBody(event);
			if (!body.id) {
				return { status: 400, message: "Tag ID is required for update" };
			}

			const updatedTag = await EvaluationTagService.updateTag(body.id, body);
			return { status: 200, tag: updatedTag };
		}

		if (method === "DELETE") {
			const query = getQuery(event);
			const tagId = query.id ? Number(query.id) : undefined;

			if (!tagId) {
				return { status: 400, message: "Tag ID is required for deletion" };
			}

			await EvaluationTagService.deleteTag(tagId);
			return { status: 200, message: "Tag deleted successfully" };
		}

		return { status: 405, message: "Method Not Allowed" };
	} catch (error) {
		console.error(error);
		return { status: 500, message: "Internal Server Error" };
	}
});
