import prisma from "../utils/prisma";

class ImageService {
	async createImage(data: {
		typekey: string;
		path: string;
		altText: string;
		caption: string;
		evaluationFactor?: number;
		status?: string;
		userId: number;
	}) {
		try {
			const image = await prisma.image.create({
				data: {
					typekey: data.typekey,
					path: data.path,
					altText: data.altText,
					caption: data.caption,
					evaluationFactor: data.evaluationFactor || 0,
					status: data.status || "active",
					userId: data.userId,
				},
			});

			return image;
		} catch (error) {
			throw new Error(`Error creating Image: ${error}`);
		}
	}

	async getAllImagesByUser(userId: number) {
		try {
			const images = await prisma.image.findMany({
				where: { userId },
				include: { user: true },
			});
			return images;
		} catch (error) {
			throw new Error(`Error fetching Images for user ${userId}: ${error}`);
		}
	}

	async getImageById(id: number) {
		try {
			const image = await prisma.image.findUnique({
				where: { id },
				include: { user: true },
			});

			if (!image) {
				throw new Error(`Image not found with id: ${id}`);
			}

			return image;
		} catch (error) {
			throw new Error(`Error fetching Image: ${error}`);
		}
	}

	async updateImage(
		id: number,
		data: {
			typekey?: string;
			altText?: string;
			caption?: string;
			evaluationFactor?: number;
			status?: string;
		},
	) {
		try {
			const updatedImage = await prisma.image.update({
				where: { id },
				data: {
					typekey: data.typekey,
					altText: data.altText,
					caption: data.caption,
					evaluationFactor: data.evaluationFactor,
					status: data.status,
				},
			});

			return updatedImage;
		} catch (error) {
			console.error(error);
			throw new Error(`Error updating Image with id ${id}`);
		}
	}

	async deleteImage(id: number) {
		try {
			const deletedImage = await prisma.image.delete({
				where: { id },
			});

			return { status: 200, message: "Image deleted successfully" };
		} catch (error) {
			console.error(error);
			throw new Error(`Error deleting Image: ${error}`);
		}
	}
}

export default new ImageService();
