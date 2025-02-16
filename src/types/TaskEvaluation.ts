import type { TaskEvaluationTag } from "./TaskEvaluationTag";

export type AddTaskEvaluation = {
	userId: number;
	taskId: number;
	content: string;
	effect: string | null;
	accuracy: number;
	impact: number;
	tagIds: number[];
};

export type TaskEvaluation = {
	id: number;
	taskId: number;
	userId: number;
	content: string;
	effect: string | null;
	accuracy: number;
	impact: number;
	createdAt: Date;
	updatedAt: Date;
	tags: TaskEvaluationTag[];
};

export type UpdateTaskEvaluation = Omit<TaskEvaluation, "tags"> & {
	tagIds: number[];
};
