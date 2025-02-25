import type { EvaluationTag } from "./EvaluationTag";
import type { Imager } from "./Imager";
import type { Message } from "./Message";
import type { UserRoom } from "./Room";
import type { Task } from "./Task";
import type { TaskEvaluation } from "./TaskEvaluation";
import type { User } from "./User";

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

export type ImagerResponse = {
	status: number;
	images: Imager[];
};

export type ImagerCreateResponse = {
	status: number;
	path: string;
	image: Imager;
};

export type RoomResponse = {
	status: number;
	rooms: UserRoom[];
};

export type MessageResponse = {
	status: number;
	messages: Message[];
};
