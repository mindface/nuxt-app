<script setup lang="ts">
import { ref } from "vue";
import { downloadPdf } from "../utils/downloadPdf";

const distHTML = ref<HTMLDivElement>();

const sender = ref("");
const recipient = ref("××会社 御中");
const subject = ref("見積書送付の件");
const message = ref("添付のPDFをご確認ください。");

const generatePDF = async () => {
	if (distHTML.value) {
		downloadPdf({
			sender: sender.value,
			recipient: recipient.value,
			subject: subject.value,
			message: message.value,
		});
	}
};
</script>

<template>
  <div>
    content PDF
    <div ref="distHTML" class="dist-pdf p-4 shadow">
      <p class="pb-4">
        <input type="text" placeholder="〇〇株式会社" v-model="sender" />
      </p>
      <p class="pb-4">
        <input type="text" placeholder="〇〇株式会社" v-model="recipient" />
      </p>
      <p class="pb-4">
        <input type="text" placeholder="見積書送付の件" v-model="subject" />
      </p>
      <p class="pb-4">
        <input type="text" placeholder="添付のPDFをご確認ください。" v-model="message" />
      </p>
    </div>
    <button
        class="bg-indigo-700 font-semibold text-white py-2 px-4 rounded"
        @click="generatePDF"
      >PDFを生成</button>
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