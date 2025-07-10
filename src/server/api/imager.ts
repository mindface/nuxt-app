import { existsSync, promises as fs } from "fs";
import {
	defineEventHandler,
	getQuery,
	readBody,
	readMultipartFormData,
} from "h3";
import path from "path";
import ImagerService from "../services/imagerService";
import { useAuth } from "../utils/auth";
import prisma from "../utils/prisma";

export default defineEventHandler(async (event) => {
	await useAuth(event);
	try {
		const method = event.method;
		const uploadDir = path.join(process.cwd(), "src/public/images");

		if (method === "GET") {
			try {
				const query = await getQuery(event);
				const { userId } = query;
				const images = await ImagerService.getAllImagesByUser(Number(userId));
				return { status: 201, images: images };
			} catch (error) {
				console.error("Error reading directory:", error);
				return { status: 500, message: "Failed to read image directory" };
			}
		}

		if (method === "PUT") {
			try {
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
				const imageIdField = formData.find((field) => field.name === "imageId");
				const imageId =
					imageIdField && "data" in imageIdField
						? imageIdField.data.toString()
						: "";
				const typekeyField = formData.find((field) => field.name === "typekey");
				const typekey =
					typekeyField && "data" in typekeyField
						? typekeyField.data.toString()
						: "";
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
				const statusField = formData.find((field) => field.name === "status");
				const status =
					statusField && "data" in statusField
						? statusField.data.toString()
						: "";
				const evaluationFactorField = formData.find(
					(field) => field.name === "evaluationFactor",
				);
				const evaluationFactor =
					evaluationFactorField && "data" in evaluationFactorField
						? evaluationFactorField.data.toString()
						: "";

				const image = await ImagerService.updateImage(Number(imageId), {
					typekey: typekey ?? "",
					altText: altText ?? "",
					caption: caption ?? "",
					evaluationFactor:
						evaluationFactor !== undefined ? Number(evaluationFactor) : 0,
					status: status ?? "active",
				});

				return { status: 200, message: "Image updated successfully", image };
			} catch (error) {
				console.error("Error updating image:", error);
				return { status: 500, message: "Failed to update image" };
			}
		}

		if (method === "DELETE") {
			try {
				const body = await readBody(event);
				const { id } = body;

				if (!id) {
					return { status: 400, message: "ID is required" };
				}

				const image = await prisma.image.findUnique({
					where: { id: Number(id) },
				});
				if (!image) {
					return { status: 404, message: "Image not found" };
				}

				const filePath = path.join(uploadDir, path.basename(image.path));
				if (existsSync(filePath)) {
					await fs.unlink(filePath);
				}

				await ImagerService.deleteImage(Number(id));

				return { status: 200, message: "Image deleted successfully" };
			} catch (error) {
				console.error("Error deleting image:", error);
				return { status: 500, message: "Failed to delete image" };
			}
		}

		return { status: 405, message: "Method Not Allowed" };
	} catch (error) {
		console.error("Upload error:", error);
		return { status: 500, message: "Internal Server Error" };
	}
});
