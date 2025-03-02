import { existsSync, promises as fs, readdirSync } from "fs";
import { defineEventHandler, readMultipartFormData } from "h3";
import path from "path";
import { useAuth } from "../utils/auth";
import prisma from "../utils/prisma";

export default defineEventHandler(async (event) => {
	await useAuth(event);
	try {
		const method = event.method;
		const uploadDir = path.join(process.cwd(), "src/public/images");

		if (method === "GET") {
			try {
				if (!existsSync(uploadDir)) {
					return { status: 200, files: [] };
				}
				const files = await readdirSync(uploadDir);
				return {
					status: 201,
					pathList: files.map((file) => ({ path: `/images/${file}` })),
				};
			} catch (error) {
				console.error("Error reading directory:", error);
				return { status: 500, message: "Failed to read image directory" };
			}
		}

		if (method === "POST") {
			const formData = await readMultipartFormData(event);
			if (!formData) {
				return { status: 400, message: "No file uploaded" };
			}
			const userIdField = formData.find((field) => field.name === "userId");
			if (!userIdField || !("data" in userIdField)) {
				return { status: 401, message: "Unauthorized: User ID is required" };
			}
			const userId = parseInt(String(userIdField.data.toString()), 10);
			if (isNaN(userId)) {
				return { status: 400, message: "Invalid User ID" };
			}
			const altTextField = formData.find((field) => field.name === "altText");
			const altText =
				altTextField && "data" in altTextField
					? altTextField.data.toString()
					: "";

			const captionField = formData.find((field) => field.name === "caption");
			const caption =
				captionField && "data" in captionField
					? captionField.data.toString()
					: "";

			// const evaluationFactorField = formData.find(
			// 	(field) => field.name === "evaluationFactor",
			// );
			// const evaluationFactor = evaluationFactorField && "data" in evaluationFactorField
			//   ? parseFloat(evaluationFactorField.data.toString())
			//   : 0;

			// const statusField = formData.find((field) => field.name === "status");
			// const status = statusField && "data" in statusField ? statusField.data.toString() : "active";

			const file = formData.find((field) => field.name === "file");
			if (!file) {
				return { status: 400, message: "Image file is required" };
			}

			const uploadDir = path.join(process.cwd(), "src/public/images");
			await fs.mkdir(uploadDir, { recursive: true });

			const filePath = path.join(uploadDir, file?.filename ?? "");
			await fs.writeFile(filePath, file.data);

			const image = await prisma.image.create({
				data: {
					typekey: "task",
					path: `/images/${file.filename}`,
					altText: altText as string,
					caption: caption as string,
					evaluationFactor: 0,
					status: "active",
					userId,
				},
			});

			return { status: 201, filePath: `/images/${file.filename}`, image };
		}

		return { status: 405, message: "Method Not Allowed" };
	} catch (error) {
		console.error("Upload error:", error);
		return { status: 500, message: "Internal Server Error" };
	}
});
