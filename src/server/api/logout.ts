import { defineEventHandler, deleteCookie } from "h3";

export default defineEventHandler(async (event) => {
	if (event.method === "GET") {
		deleteCookie(event, "auth_token");
		deleteCookie(event, "auth_expires_at");
		return { message: "Logged out" };
	}
});
