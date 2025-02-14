import prisma from "../utils/prisma";

class taskEvaluationTagService {
	async getTagsByTaskEvaluationId(taskEvaluationId: number) {
		return await prisma.taskEvaluationTag.findMany({
			where: { taskEvaluationId },
			include: { tag: true },
		});
	}

	async addTagsToTaskEvaluation(taskEvaluationId: number, tagIds: number[]) {
		const tagRelations = tagIds.map((tagId) => ({
			taskEvaluationId,
			tagId,
		}));

		return await prisma.taskEvaluationTag.createMany({
			data: tagRelations,
		});
	}

	async removeTagFromTaskEvaluation(taskEvaluationId: number, tagId: number) {
		return await prisma.taskEvaluationTag.deleteMany({
			where: { taskEvaluationId, tagId },
		});
	}
}

export default new taskEvaluationTagService();
