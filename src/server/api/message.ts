import { defineEventHandler, getQuery, readMultipartFormData } from "h3";
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
			const formData = await readMultipartFormData(event);
			if (!formData) {
				return { status: 400, message: "No data commit" };
			}
			const roomIdField = formData.find((field) => field.name === "roomId");
			const roomId =
				roomIdField && "data" in roomIdField ? roomIdField.data.toString() : "";
			const senderIdField = formData.find((field) => field.name === "senderId");
			if (!senderIdField || !("data" in senderIdField)) {
				return { status: 401, message: "Unauthorized: User ID is required" };
			}
			const senderId = parseInt(String(senderIdField.data.toString()), 10);
			if (isNaN(senderId)) {
				return { status: 400, message: "Invalid User ID" };
			}
			const contentField = formData.find((field) => field.name === "content");
			const content =
				contentField && "data" in contentField
					? contentField.data.toString()
					: "";
			const message = await messageService.sendMessage(
				roomId,
				senderId,
				content,
			);
			return { status: 201, message };
		}

		return { status: 405, message: "Method Not Allowed" };
	} catch (error) {
		console.error(error);
		return { status: 500, message: "Internal Server Error" };
	}
});
