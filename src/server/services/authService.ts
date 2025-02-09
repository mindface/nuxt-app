import prisma from "../utils/prisma";
import { generateToken } from "../utils/jwt";
import bcryptjs from "bcryptjs";

export const authenticateUser = async (email: string, password: string) => {
	const user = await prisma.user.findUnique({
		where: { email },
	});

	if (!user) {
		throw Error("Invalid email or password");
	}

	const isPasswordValid = await bcryptjs.compare(password, user.password);
	if (!isPasswordValid) {
		throw Error("Invalid email or password");
	}

	// パスワードをレスポンスから除外
	(user as Partial<typeof user>).password = undefined;

	const token = generateToken(user.email);
	const expiresIn = 3600; // 1時間
	const expiresAt = Date.now() + expiresIn * 1000;

	await prisma.user.update({
		where: { id: user.id },
		data: { lastLogin: new Date() },
	});

	return { user, token, expiresAt };
};
