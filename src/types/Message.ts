import type { Room } from "./Room";
import type { User } from "./User";

export type AddMessage = {
	roomId: number;
	senderId: number;
	content: string;
};

export type Message = {
	id: string;
	roomId: string;
	senderId: number;
	content: string;
	createdAt: Date;
	room: Room;
	sender: User;
};
