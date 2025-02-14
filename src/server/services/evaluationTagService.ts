import prisma from "../utils/prisma";

class evaluationTagService {
	async getAllTags() {
		return await prisma.evaluationTag.findMany();
	}

	async createTag(data: { key: string; industry: string; label: string }) {
		const existingTag = await prisma.evaluationTag.findUnique({
			where: { key: data.key },
		});
		if (existingTag) {
			throw new Error(`Tag with key '${data.key}' already exists.`);
		}
		return await prisma.evaluationTag.create({ data });
	}

	async updateTag(
		tagId: number,
		data: { key?: string; industry?: string; label?: string },
	) {
		return await prisma.evaluationTag.update({
			where: { id: tagId },
			data,
		});
	}

	async deleteTag(tagId: number) {
		return await prisma.evaluationTag.delete({ where: { id: tagId } });
	}
}

export default new evaluationTagService();
