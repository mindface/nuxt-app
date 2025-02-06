import { type H3Event, createError, getHeader } from "h3";
import jwt from "jsonwebtoken";

export const useAuth = async (event: H3Event) => {
	const authHeader = getHeader(event, "authorization");

	console.log("Authorization Header:", authHeader); // ✅ ヘッダー確認用

	if (!authHeader || !authHeader.startsWith("Bearer ")) {
		console.log("🚨 No Authorization header found or format incorrect");
		throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
	}

	const token = authHeader.split(" ")[1];

	try {
		if (!process.env.JWT_SECRET) {
			console.log("🚨 JWT_SECRET is missing in environment variables");
			throw new Error("JWT_SECRET is not set");
		}

		const decoded = jwt.verify(token, process.env.JWT_SECRET!);
		event.context.user = decoded;

		console.log("✅ Token verified successfully:", decoded);
	} catch (error) {
		console.log("🚨 Token verification failed:", error);
		throw createError({ statusCode: 401, statusMessage: "Invalid Token" });
	}
};
