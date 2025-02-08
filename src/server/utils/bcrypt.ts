import bcryptjs from "bcryptjs";

export const hashPassword = async (password: string) => {
	return await bcryptjs.hash(password, 10);
};
