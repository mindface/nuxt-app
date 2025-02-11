import prisma from "../utils/prisma";
import { hashPassword } from "../utils/bcrypt";

export const getUserById = async (id: number) => {
	const users = await prisma.user.findMany();
	console.log(users);
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
	const newUser = await prisma.user.create({
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
	return newUser;
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
	const updateUser = await prisma.user.update({
		where: { id },
		data: {
			...data,
			updatedAt: new Date(),
		},
	});
	return updateUser;
};

export const deleteUser = async (id: number) => {
	await prisma.user.delete({
		where: { id },
	});
};
