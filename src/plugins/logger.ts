import pino from "pino";
import { join } from "path";

const logFilePath = join(process.cwd(), "logs/server.log");
const logStream = pino.destination(logFilePath);

export const logger = pino({
	level: "info",
	formatters: {
		bindings: () => ({}),
	},
	transport: {
		targets: [
			{
				target: "pino-pretty", // 開発時のコンソール出力
				options: {
					colorize: true,
					translateTime: "yyyy-MM-dd HH:mm:ss.SSS",
					ignore: "pid,hostname",
				},
			},
			{
				target: "pino/file", // ファイル出力
				options: { destination: logFilePath, mkdir: true },
			},
		],
	},
});

// export default defineNuxtPlugin(() => {
//   return {
//     provide: {
//       logger
//     }
//   };
// });
