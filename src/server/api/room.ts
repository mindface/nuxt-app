import { defineEventHandler, getQuery, readMultipartFormData } from "h3";
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
			const formData = await readMultipartFormData(event);
			if (!formData) {
				return { status: 400, message: "No data commit" };
			}
			const userIdField = formData.find((field) => field.name === "userId");
			if (!userIdField || !("data" in userIdField)) {
				return { status: 401, message: "Unauthorized: User ID is required" };
			}
			const userId = parseInt(String(userIdField.data.toString()), 10);
			if (isNaN(userId)) {
				return { status: 400, message: "Invalid User ID" };
			}
			const nameField = formData.find((field) => field.name === "name");
			const name =
				nameField && "data" in nameField ? nameField.data.toString() : "";

			if (!name) {
				return { status: 400, message: "Room name and user ID are required" };
			}
			const room = await roomService.createRoom(name, userId);
			return { status: 201, room };
		}

		return { status: 405, message: "Method Not Allowed" };
	} catch (error) {
		console.error(error);
		return { status: 500, message: "Internal Server Error" };
	}
});
