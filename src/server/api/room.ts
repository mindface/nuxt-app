import { defineEventHandler, getQuery, readBody } from "h3";
import roomService from "../services/roomService";
import { useAuth } from "../utils/auth";

export default defineEventHandler(async (event) => {
	await useAuth(event);
	try {
		const method = event.method;
		if (method === "GET") {
			const query = getQuery(event);
			const userId = query.userId ? Number(query.userId) : undefined;

			if (!userId) return { status: 400, message: "User ID is required" };
			const rooms = await roomService.getUserRooms(userId);
			return { status: 200, rooms };
		}

		if (method === "POST") {
			const body = await readBody(event);
			if (!body.name || !body.userId)
				return { status: 400, message: "Room name and user ID are required" };
			const room = await roomService.createRoom(body.name, body.userId);
			return { status: 201, room };
		}

		return { status: 405, message: "Method Not Allowed" };
	} catch (error) {
		console.error(error);
		return { status: 500, message: "Internal Server Error" };
	}
});
