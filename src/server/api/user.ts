import { defineEventHandler, getQuery, readBody } from "h3";
import {
	getUserById,
	createUser,
	updateUser,
	deleteUser,
} from "../services/userService";
import { useAuth } from "../utils/auth";

export default defineEventHandler(async (event) => {
	try {
		const method = event.method;

		if (["PUT", "DELETE", "GET"].includes(method)) {
			try {
				await useAuth(event);
			} catch (error) {
				console.error(error);
				return { status: 401, message: "Unauthorized" };
			}
		}

		if (method === "GET") {
			const query = getQuery(event);
			const userId = query.id ? Number(query.id) : undefined;
			if (!userId) return { status: 400, message: "User ID is required" };

			const user = await getUserById(userId);
			return user
				? { status: 200, user }
				: { status: 404, message: "User not found" };
		}

		if (method === "POST") {
			const body = await readBody(event);
			if (!body.name || !body.email || !body.password) {
				return {
					status: 400,
					message: "Name, email, and password are required",
				};
			}

			const newUser = await createUser(body);
			return { status: 201, user: newUser };
		}

		if (method === "PUT") {
			const body = await readBody(event);
			if (!body.id)
				return { status: 400, message: "User ID is required for update" };

			const updatedUser = await updateUser(body.id, body);

			return { status: 200, user: updatedUser };
		}

		if (method === "DELETE") {
			const query = getQuery(event);
			if (!query.id) {
				return { status: 400, message: "User ID is required for deletion" };
			}

			await deleteUser(Number(query.id));
			return { status: 200, message: "User deleted successfully" };
		}

		return { status: 405, message: "Method Not Allowed" };
	} catch (error) {
		console.error(error);
		return { status: 500, message: "Internal Server Error" };
	}
});
