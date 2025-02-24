import type { Message } from "./Message";
import type { User } from "./User";

export type AddRoom = {
	name: string;
	userId: number;
};

export type Room = {
	id: string;
	name?: string;
	users: UserRoom[];
	messages: Message[];
	createdAt: Date;
};

export type UserRoom = {
	id: string;
	userId: number;
	roomId: string;
	user: User;
	room: Room;
	createdAt: Date;
};
