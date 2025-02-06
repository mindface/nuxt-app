import { PrismaClient } from "@prisma/client";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import type { User } from "../../types/User";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
	const body = await readBody(event);
	if (event.method === "POST") {
		const user: User | null = await prisma.user.findUnique({
			where: { email: body.email },
		});
		if (!user) {
			throw createError({
				statusCode: 401,
				message: "Invalid email or password",
			});
		}
		const isPasswordValid = await bcryptjs.compare(
			body.password,
			user.password,
		);
		if (!isPasswordValid) {
			throw createError({
				statusCode: 401,
				message: "Invalid email or password",
			});
		}
		(user as Partial<typeof user>).password = undefined;
		const token = jwt.sign(
			{ username: body.username },
			process.env.JWT_SECRET!,
			{
				expiresIn: "1h",
			},
		);
		// 1時間（秒）
		const expiresIn = 3600;
		const expiresAt = Date.now() + expiresIn * 1000;

		setCookie(event, "auth_token", token, {
			httpOnly: false,
			maxAge: 3600,
			secure: process.env.NODE_ENV === "production",
		});
		setCookie(event, "auth_expires_at", expiresAt.toString(), {
			httpOnly: false,
			maxAge: expiresIn,
			secure: process.env.NODE_ENV === "production",
		});

		try {
			await prisma.user.update({
				where: { id: user.id },
				data: { lastLogin: new Date() },
			});

			return {
				status: 201,
				user: user,
				token: token,
				expiresAt: expiresAt,
			};
		} catch (error) {
			console.error(error);
		}
	}
});
