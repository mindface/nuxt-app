export default defineEventHandler(async (event) => {
	if (event.method === "GET") {
		deleteCookie(event, "auth_token");
		return { message: "Logged out" };
	}
});
