import prisma from "../utils/prisma";

class RoomService {
	async createRoom(name: string, userId: number) {
		try {
			const room = await prisma.room.create({
				data: {
					name,
					users: {
						create: {
							userId,
						},
					},
				},
				include: { users: true },
			});
			return room;
		} catch (error) {
			throw new Error(`Error creating Room: ${error}`);
		}
	}

	async getUserRooms(userId: number) {
		try {
			return await prisma.userRoom.findMany({
				where: { userId },
				include: { room: true },
			});
		} catch (error) {
			throw new Error(`Error fetching user rooms: ${error}`);
		}
	}
}

export default new RoomService();
