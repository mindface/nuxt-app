import { PrismaClient } from "@prisma/client";
import fs from "fs";
import { join } from "path";

const logFilePath = join(process.cwd(), "logs/query.log");
const logStream = fs.createWriteStream(logFilePath, { flags: "a" });

import pino from "pino";
const logger = pino({ level: "info" }, logStream);
const prisma = new PrismaClient({
	log: [
		{
			emit: "event",
			level: "query",
		},
		{
			emit: "event",
			level: "info",
		},
		{
			emit: "event",
			level: "warn",
		},
		{
			emit: "event",
			level: "error",
		},
	],
});

prisma.$on("query", (e) => {
	logger.info(
		{ query: e.query, params: e.params, duration: e.duration },
		"DB Query Executed",
	);
});

prisma.$on("info", (e) => {
	logger.info(e, "Prisma Info");
});

prisma.$on("warn", (e) => {
	logger.warn(e, "Prisma Warning");
});

prisma.$on("error", (e) => {
	logger.error(e, "Prisma Error");
});

export default prisma;
