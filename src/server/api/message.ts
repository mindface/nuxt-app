import { defineEventHandler, getQuery, readBody } from "h3";
import messageService from "../services/messageService";
import { useAuth } from "../utils/auth";

export default defineEventHandler(async (event) => {
	await useAuth(event);
	try {
		const method = event.method;
		if (method === "GET") {
			const query = getQuery(event);
			const roomId = query.roomId ? String(query.roomId) : undefined;

			if (!roomId) return { status: 400, message: "Room ID is required" };
			const messages = await messageService.getRoomMessages(roomId);
			return { status: 200, messages };
		}

		if (method === "POST") {
			const body = await readBody(event);
			if (!body.roomId || !body.senderId || !body.content)
				return {
					status: 400,
					message: "Room ID, sender ID, and content are required",
				};
			const message = await messageService.sendMessage(
				body.roomId,
				body.senderId,
				body.content,
			);
			return { status: 201, message };
		}

		return { status: 405, message: "Method Not Allowed" };
	} catch (error) {
		console.error(error);
		return { status: 500, message: "Internal Server Error" };
	}
});
