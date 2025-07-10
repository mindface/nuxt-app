export const downloadPdf = async (data: {
	sender: string;
	recipient: string;
	subject: string;
	message: string;
}) => {
	try {
		const response = await fetch("/api/generatePdf", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(data),
		});

		if (!response.ok) throw new Error("PDFの取得に失敗しました");

		const blob = await response.blob();
		const url = window.URL.createObjectURL(blob);
		window.open(url, "_blank");

		// メモリ解放（必要に応じて）
		setTimeout(() => {
			window.URL.revokeObjectURL(url);
		}, 5000);

		// ダウンロード用
		// const a = document.createElement("a");
		// a.href = url;
		// a.download = "送付状.pdf";
		// document.body.appendChild(a);
		// a.click();
		// document.body.removeChild(a);
		// window.URL.revokeObjectURL(url);
	} catch (error) {
		console.error("PDFダウンロードエラー:", error);
	}
};
