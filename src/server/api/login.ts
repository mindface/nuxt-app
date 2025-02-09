import { defineEventHandler, readBody, setCookie } from "h3";
import { authenticateUser } from "../services/authService";

export default defineEventHandler(async (event) => {
	if (event.method !== "POST") {
		return { status: 405, message: "Method Not Allowed" };
	}
	try {
		const body = await readBody(event);
		if (!body.email || !body.password) {
			return { status: 400, message: "Email and password are required" };
		}
		const { user, token, expiresAt } = await authenticateUser(
			body.email,
			body.password,
		);

		setCookie(event, "auth_token", token, {
			httpOnly: false,
			maxAge: 3600,
			secure: process.env.NODE_ENV === "production",
		});

		setCookie(event, "auth_expires_at", expiresAt.toString(), {
			httpOnly: false,
			maxAge: 3600,
			secure: process.env.NODE_ENV === "production",
		});

		return { status: 201, user, token, expiresAt };
	} catch (error) {
		console.error(error);
		return { status: 500, message: "Internal Server Error" };
	}
});
