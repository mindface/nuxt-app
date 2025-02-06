import { PrismaClient } from "@prisma/client";
import { useAuth } from "../utils/auth";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
	await useAuth(event);

	if (event.method === "GET") {
		const query = getQuery(event);
		if (query.userId && query.id) {
			const items = await prisma.task.findMany({
				where: {
					userId: Number(query.userId),
					id: Number(query.id),
				},
			});
			return items[0];
		} else if (query.userId) {
			return await prisma.task.findMany({
				where: {
					userId: Number(query.userId),
				},
			});
		}
	} else if (event.method === "POST") {
		const body = await readBody(event);
		try {
			const newTask = await prisma.task.create({
				data: {
					title: body.title,
					detail: body.detail,
					evaluationFactor: body.evaluationFactor,
					status: "run",
					userId: body.userId,
				},
			});
			return {
				status: 201,
				user: newTask,
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
			return { status: 400, message: "Task ID is required for update" };
		}
		try {
			const updatedUser = await prisma.task.update({
				where: { id: body.id },
				data: {
					title: body.title,
					detail: body.detail,
					evaluationFactor: body.evaluationFactor,
					status: body.status,
					userId: body.userId,
				},
			});

			return {
				status: 200,
				user: updatedUser,
			};
		} catch (error) {
			return {
				status: 500,
				message: "Error creating user",
			};
		}
	} else if (event.method === "DELETE") {
		const query = getQuery(event);

		if (!query.id) {
			return { status: 400, message: "Task ID is required for deletion" };
		}

		try {
			await prisma.task.delete({
				where: { id: Number(query.id) },
			});

			return {
				status: 200,
				message: "Task deleted successfully",
			};
		} catch (error) {
			return {
				status: 500,
				message: "Error deleting user",
			};
		}
	}
});
