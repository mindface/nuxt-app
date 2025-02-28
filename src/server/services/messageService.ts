import prisma from "../utils/prisma";

class MessageService {
	async sendMessage(roomId: string, senderId: number, content: string) {
		try {
			const message = await prisma.message.create({
				data: {
					roomId,
					senderId,
					content,
				},
			});
			return message;
		} catch (error) {
			throw new Error(`Error sending message: ${error}`);
		}
	}

	async getRoomMessages(roomId: string) {
		try {
			return await prisma.message.findMany({
				where: { roomId },
				include: { sender: true },
			});
		} catch (error) {
			throw new Error(`Error fetching messages: ${error}`);
		}
	}
}

export default new MessageService();
