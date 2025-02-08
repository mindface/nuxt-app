import prisma from "../utils/prisma";

export const getTasks = async (userId: number, taskId?: number) => {
	return taskId
		? await prisma.task.findUnique({
				where: { id: taskId, userId },
			})
		: await prisma.task.findMany({
				where: { userId },
			});
};

export const createTask = async (data: {
	title: string;
	detail: string;
	evaluationFactor: number;
	userId: number;
}) => {
	return await prisma.task.create({
		data: { ...data, status: "run" },
	});
};

export const updateTask = async (
	id: number,
	data: {
		title: string;
		detail: string;
		evaluationFactor: number;
		status: string;
		userId: number;
	},
) => {
	return await prisma.task.update({
		where: { id },
		data,
	});
};

export const deleteTask = async (id: number) => {
	return await prisma.task.delete({
		where: { id },
	});
};
