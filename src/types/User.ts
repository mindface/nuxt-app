export type User = {
	id: number;
	name: string;
	email: string;
	detail: string;
	lastLogin: Date | null;
	role: string;
	status: string;
	createdAt: Date;
	updatedAt: Date;
	isActive: boolean;

	// 削除用に設定
	password: string;
};

export type AddUser = {
	name: string;
	email: string;
	password: string;
	detail: string;
};
