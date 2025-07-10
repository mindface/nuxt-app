<script setup lang="ts">
import { Buffer } from "buffer";
import pdfMake from "pdfmake/build/pdfmake";
import { vfs } from "pdfmake/build/vfs_fonts";
import { ref } from "vue";

const title = ref("1. 契約の目的");
const detail = ref("");
const goal = ref("本契約の目的は、双方の合意に基づく業務を遂行することです。");

const generatePDF = async () => {
	const responseBold = await fetch("/fonts/GenJyuuGothic-Bold.ttf");
	const arrayBufferBold = await responseBold.arrayBuffer();

	const responseNormal = await fetch("/fonts/GenJyuuGothic-Normal.ttf");
	const arrayBufferNormal = await responseNormal.arrayBuffer();
	const base64Bold = Buffer.from(arrayBufferBold).toString("base64");
	const base64Normal = Buffer.from(arrayBufferNormal).toString("base64");
	pdfMake.vfs = {
		...vfs,
		"GenJyuuGothic-Bold.ttf": base64Bold,
		"GenJyuuGothic-Normal.ttf": base64Normal,
	};

	const documentDefinition: any = {
		content: [
			{ text: "契約書", style: "header" },
			{
				text: "この契約書は、以下の条項に基づいて作成されました。",
				style: "subheader",
				margin: [0, 10],
			},
			{
				text: title.value,
				style: "sectionHeader",
			},
			{
				text: goal.value,
				style: "bodyText",
				margin: [0, 0, 0, 15],
			},
			{
				text: "2. 契約の期間",
				style: "sectionHeader",
			},
			{
				text: "本契約の期間は、2025年1月1日から2026年1月1日までとします。",
				style: "bodyText",
				margin: [0, 0, 0, 15],
			},
			createTable(),
			{ text: "署名:", style: "footer" },
			{ text: "________________________", style: "footer" },
		],
		styles: {
			styles: {
				header: {
					fontSize: 22,
					bold: true,
					alignment: "center",
					margin: [0, 20, 0, 20],
					font: "GenJyuuGothic-Bold", // 日本語フォントを指定
				},
				subheader: {
					fontSize: 16,
					italics: true,
					alignment: "center",
					margin: [0, 10, 0, 10],
					font: "GenJyuuGothic-Normal", // 日本語フォントを指定
				},
				sectionHeader: {
					fontSize: 14,
					bold: true,
					margin: [0, 20, 0, 5],
					font: "GenJyuuGothic-Bold", // 日本語フォントを指定
				},
				bodyText: {
					fontSize: 12,
					margin: [0, 0, 0, 10],
					font: "GenJyuuGothic-Normal", // 日本語フォントを指定
				},
				footer: {
					fontSize: 12,
					italics: true,
					alignment: "right",
					margin: [0, 40, 0, 0],
					font: "GenJyuuGothic-Normal", // 日本語フォントを指定
				},
			},
		},
		defaultStyle: {
			font: "Helvetica",
		},
		fonts: {
			Helvetica: {
				normal: "Helvetica", // normalの定義
				bold: "Helvetica-Bold", // boldの定義
				italics: "Helvetica-Oblique", // italicsの定義
				bolditalics: "Helvetica-BoldOblique", // bold italicsの定義
			},
		},
	};

	await pdfMake.createPdf(documentDefinition).download("contract.pdf"); // PDFを新しいタブで表示
};

// テーブルを作成する関数
const createTable = () => {
	return {
		table: {
			headerRows: 1,
			widths: [150, "*", 100],
			body: [
				["項目", "詳細", "金額"],
				["業務内容1", "詳細情報1", "¥100,000"],
				["業務内容2", "詳細情報2", "¥150,000"],
				["業務内容3", "詳細情報3", "¥200,000"],
			],
		},
		layout: "lightHorizontalLines",
	};
};
</script>

<template>
  <div>
    content PDF
    <div class="make-pdf">
      <p class="p-2">
        <input type="text" v-model="title" />
      </p>
      <p class="p-2">
        <input type="text" v-model="detail" />
      </p>
      <p class="p-2">
        <input type="text" v-model="goal" />
      </p>
      <button
        class="bg-indigo-700 font-semibold text-white py-2 px-4 rounded"
        @click="generatePDF"
      >set</button>
      <button @click="generatePDF">PDFを生成</button>
    </div>
  </div>
</template>

<style scoped>
button {
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
button:hover {
  background-color: #0056b3;
}
</style>