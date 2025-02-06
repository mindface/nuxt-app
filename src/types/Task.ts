import type { User } from "./User";

export type AddTask = {
	title: string;
	detail: string | null;
	evaluationFactor: number;
	userId: number;
};

export type Task = {
	id: number;
	title: string;
	detail: string | null;
	evaluationFactor: number;
	status: string;
	userId: number;
	lastLogin: Date | null;
	user: User;
	createdAt: Date;
	updatedAt: Date;
};
