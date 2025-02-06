import { PrismaClient } from "@prisma/client";
import bcryptjs from "bcryptjs";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
	if (event.method === "GET") {
		const query = getQuery(event);
		if (query.id) {
			return await prisma.user.findUnique({
				where: { id: Number(query.id) },
			});
		} else {
			return {
				status: 500,
				message: "Error creating user id",
			};
		}
	} else if (event.method === "POST") {
		const body = await readBody(event);
		const hashedPassword = await bcryptjs.hash(body.password, 10);
		try {
			const newUser = await prisma.user.create({
				data: {
					name: body.name,
					email: body.email,
					password: hashedPassword,
					detail: body.detail,
					status: body.status,
					role: body.role || "user",
					isActive: body.isActive !== undefined ? body.isActive : true,
					lastLogin: null,
					createdAt: new Date(),
					updatedAt: new Date(),
				},
			});

			return {
				status: 201,
				user: newUser,
			};
		} catch (error) {
			return {
				status: 500,
				message: "Error creating user",
			};
		}
	} else if (event.method === "PUT") {
		const body = await readBody(event);
		if (!body.id) {
			return { status: 400, message: "User ID is required for update" };
		}
		try {
			const updatedUser = await prisma.user.update({
				where: { id: body.id },
				data: {
					name: body.name,
					email: body.email,
					detail: body.detail,
					status: body.status,
					role: body.role,
					isActive: body.isActive,
					updatedAt: new Date(),
				},
			});

			return {
				status: 200,
				user: updatedUser,
			};
		} catch (error) {
			return {
				status: 500,
				message: "Error updating user",
			};
		}
	} else if (event.method === "DELETE") {
		const query = getQuery(event);

		if (!query.id) {
			return { status: 400, message: "User ID is required for deletion" };
		}

		try {
			await prisma.user.delete({
				where: { id: Number(query.id) },
			});

			return {
				status: 200,
				message: "User deleted successfully",
			};
		} catch (error) {
			return {
				status: 500,
				message: "Error deleting user",
			};
		}
	}
});
