import type { Server as SocketIOServer } from "socket.io";

declare module "nitropack" {
	interface NitroApp {
		io?: SocketIOServer;
	}
}
