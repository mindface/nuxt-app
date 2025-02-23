import {
	defineEventHandler,
	getRequestHeaders,
	getRequestURL,
	H3Event,
} from "h3";
import { logger } from "../../lib/logger";

export default defineEventHandler(async (event: H3Event) => {
	const start = Date.now();
	const { method } = event.node.req;
	const url = getRequestURL(event);
	const headers = getRequestHeaders(event);
	const requestId = headers["x-request-id"] || crypto.randomUUID();

	let body = null;
	if (method === "POST" || method === "PUT" || method === "PATCH") {
		try {
			body = await readBody(event);
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : "Unknown error";
			logger.error(
				{ method, url, requestId, error: errorMessage },
				"Failed to read request body",
			);
		}
	}

	logger.info({ method, url, requestId, body }, "Incoming request");

	const duration = Date.now() - start;
	logger.info({ method, url, requestId, duration }, "Request completed");
});
