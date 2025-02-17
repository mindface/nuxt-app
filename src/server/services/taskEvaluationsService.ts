import prisma from "../utils/prisma";

class TaskEvaluationsService {
	async createTaskEvaluation(data: {
		taskId: number;
		userId: number;
		content: string;
		effect?: string;
		accuracy?: number;
		impact?: number;
		tagIds?: number[];
	}) {
		try {
			const taskEvaluation = await prisma.taskEvaluation.create({
				data: {
					taskId: data.taskId,
					userId: data.userId,
					content: data.content,
					effect: data.effect,
					accuracy: data.accuracy || 1.0,
					impact: data.impact || 1.0,
					tags: {
						create:
							data.tagIds?.map((tagId) => ({
								tagId,
							})) || [],
					},
				},
				include: {
					task: true,
					user: true,
					tags: true,
				},
			});

			return taskEvaluation;
		} catch (error) {
			throw new Error(`Error creating Task Evaluation: ${error}`);
		}
	}

	async getTaskAllEvaluation(userId: number) {
		try {
			const evaluations = await prisma.taskEvaluation.findMany({
				where: {
					userId: userId,
				},
				include: {
					tags: {
						include: {
							tag: true,
						},
					},
				},
			});
			return evaluations;
		} catch (error) {
			throw new Error(`Error fetching Task Evaluations: ${error}`);
		}
	}

	async getTaskEvaluations(taskId: number) {
		try {
			const evaluations = await prisma.taskEvaluation.findMany({
				where: { taskId },
				include: {
					user: true,
					tags: {
						include: {
							tag: true,
						},
					},
				},
			});
			return evaluations;
		} catch (error) {
			throw new Error(`Error fetching Task Evaluations: ${error}`);
		}
	}

	async getTaskEvaluationById(id: number) {
		try {
			const evaluation = await prisma.taskEvaluation.findUnique({
				where: { id },
				include: {
					task: true,
					user: true,
					tags: {
						include: {
							tag: true,
						},
					},
				},
			});

			if (!evaluation) {
				throw new Error(`Task Evaluation not found with id: ${id}`);
			}

			return evaluation;
		} catch (error) {
			throw new Error(`Error fetching Task Evaluation: ${error}`);
		}
	}

	// Update an existing Task Evaluation
	async updateTaskEvaluation(
		id: number,
		data: {
			content?: string;
			effect?: string;
			accuracy?: number;
			impact?: number;
			tagIds?: number[];
		},
	) {
		try {
			const updatedEvaluation = await prisma.taskEvaluation.update({
				where: { id },
				data: {
					content: data.content,
					effect: data.effect,
					accuracy: data.accuracy,
					impact: data.impact,
					tags: {
						deleteMany: {},
						create:
							data.tagIds?.map((tagId) => ({
								tagId,
							})) || [],
					},
				},
				include: {
					task: true,
					user: true,
					tags: true,
				},
			});

			return updatedEvaluation;
		} catch (error) {
			throw new Error(`Error updating Task Evaluation: ${error}`);
		}
	}

	// Delete a Task Evaluation
	async deleteTaskEvaluation(id: number) {
		try {
			const deletedEvaluation = await prisma.taskEvaluation.delete({
				where: { id },
			});

			return deletedEvaluation;
		} catch (error) {
			throw new Error(`Error deleting Task Evaluation: ${error}`);
		}
	}
}

export default new TaskEvaluationsService();
