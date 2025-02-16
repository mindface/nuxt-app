import type { EvaluationTag } from "./EvaluationTag";

export type TaskEvaluationTag = {
	id: number;
	taskEvaluationId: number;
	tagId: number;
	tag: EvaluationTag;

	createdAt: Date;
};
