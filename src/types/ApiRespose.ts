import type { User } from "./User";
import type { Task } from "./Task";

export type TaskResponse = {
	status: number;
	tasks: Task;
};

export type TasksResponse = {
	status: number;
	tasks: Task[];
};

export type UserResponse = {
	status: number;
	user: User;
};
