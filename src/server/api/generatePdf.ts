import fs from "fs";
import { defineEventHandler } from "h3";
import path from "path";
import PDFDocument from "pdfkit";

export default defineEventHandler(async (event) => {
	// await useAuth(event);
	try {
		const method = event.method;

		if (method === "POST") {
			const body = await readBody(event);
			const { sender, recipient, subject, message } = body;
			const doc = new PDFDocument({ size: "A4", margin: 50 });
			let buffers: Uint8Array[] = [];

			const fontPath = path.resolve("src/public/fonts/NotoSansJP-Regular.ttf");
			doc.registerFont("NotoSansJP", fontPath);
			if (!fs.existsSync(fontPath)) {
				console.error("フォントファイルが見つかりません:", fontPath);
				return { status: 500, message: "フォントファイルが見つかりません" };
			}
			doc.registerFont("NotoSansJP", fontPath);
			// PDFのレスポンスヘッダーを設定
			event.node.res.writeHead(200, {
				"Content-Type": "application/pdf",
				"Content-Disposition": "inline; filename=document.pdf",
			});

			// PDF のストリームをレスポンスに直接書き込む
			doc.pipe(event.node.res);

			// **ヘッダー**
			// doc.font("Helvetica-Bold").fontSize(20).text("送付状", { align: "center" });
			// doc.moveDown();

			// **会社情報**
			// doc.font("Helvetica").fontSize(12);
			doc
				.font("NotoSansJP")
				.fontSize(12)
				.text(`送付元: ${sender}`, { align: "left" });
			doc.text(`送付元: ${sender}`, { align: "left" });
			doc.text(`送付先: ${recipient}`, { align: "left" });
			doc.text(`日付: ${new Date().toLocaleDateString("ja-JP")}`, {
				align: "left",
			});
			doc.moveDown();

			// **罫線**
			doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
			doc.moveDown();

			// **件名**
			doc.font("NotoSansJP").fontSize(14).text(`件名: ${subject}`);
			doc.font("NotoSansJP").fontSize(14).text(subject, { align: "center" });
			doc.moveDown();

			// **本文**
			doc
				.font("NotoSansJP")
				.fontSize(12)
				.text(message, { align: "left", lineGap: 5 });

			// **署名エリア**
			doc.moveDown().moveDown();
			doc
				.font("NotoSansJP")
				.fontSize(12)
				.text("______________________", { align: "right" });
			doc.font("NotoSansJP").fontSize(12).text("署名", { align: "right" });

			doc.end();
		}

		return { status: 405, message: "Method Not Allowed" };
	} catch (error) {
		console.error("Upload error:", error);
		return { status: 500, message: "Internal Server Error" };
	}
});
