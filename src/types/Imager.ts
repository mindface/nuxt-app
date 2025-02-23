import type { User } from "./User";

export type AddImager = {
	title: string;
	detail: string | null;
	altText: string;
	caption: string;
	evaluationFactor: number;
	userId: number;
};

export type Imager = {
	id: number;
	path: string;
	altText: string;
	caption: string;
	evaluationFactor: number;
	status: string;
	userId: number;
	user: User;
	createdAt: Date;
	updatedAt: Date;
};
