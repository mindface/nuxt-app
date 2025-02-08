import prisma from "../utils/prisma";
import { hashPassword } from "../utils/bcrypt";

export const getUserById = async (id: number) => {
	return await prisma.user.findUnique({
		where: { id },
	});
};

export const createUser = async (data: {
	name: string;
	email: string;
	password: string;
	detail: string;
	status: string;
	role: string;
	isActive?: boolean;
	lastLogin: Date | null;
	createdAt: Date;
	updatedAt: Date;
}) => {
	const hashedPassword = await hashPassword(data.password);
	return await prisma.user.create({
		data: {
			...data,
			password: hashedPassword,
			role: data.role || "user",
			isActive: data.isActive !== undefined ? data.isActive : true,
			lastLogin: null,
			createdAt: new Date(),
			updatedAt: new Date(),
		},
	});
};

export const updateUser = async (
	id: number,
	data: {
		name: string;
		email: string;
		detail: string;
		status: string;
		role: string;
		isActive: boolean;
	},
) => {
	return await prisma.user.update({
		where: { id },
		data: {
			...data,
			updatedAt: new Date(),
		},
	});
};

export const deleteUser = async (id: number) => {
	return await prisma.user.delete({
		where: { id },
	});
};
