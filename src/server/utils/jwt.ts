import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

export const generateToken = (username: string) => {
	return jwt.sign({ username }, JWT_SECRET, { expiresIn: "1h" });
};
