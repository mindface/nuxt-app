import type { User } from "./User";
import type { Task } from "./Task";
import type { TaskEvaluation } from "./TaskEvaluation";
import type { EvaluationTag } from "./EvaluationTag";

export type TaskResponse = {
	status: number;
	tasks: Task;
};

export type TasksResponse = {
	status: number;
	tasks: Task[];
};

export type TaskEvaluationResponse = {
	status: number;
	taskEvaluation: TaskEvaluation[];
};

export type EvaluationTagResponse = {
	status: number;
	tags: EvaluationTag[];
};

export type UserResponse = {
	status: number;
	user: User;
};
