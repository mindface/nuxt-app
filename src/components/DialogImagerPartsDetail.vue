<script setup lang="ts">
import { storeToRefs } from "pinia";
import Dialog from "./parts/Dialog.vue";
import { useImagerStore } from "../store/imager";
import { useAuthStore } from "../store/auth";
import { useNuxtApp } from "nuxt/app";
import { onMounted } from "vue";

type Item = {
	altText: string;
	caption: string;
	evaluationFactor: number;
	status: string;
	userId: number;
};

const { $t } = useNuxtApp();

const props = defineProps({
	item: {
		type: Object as PropType<Item>,
	},
});

const imagerStore = useImagerStore();
const authStore = useAuthStore();
const { imagerLinst } = storeToRefs(imagerStore);
const { authUser } = storeToRefs(authStore);

const fromSwicher = ref(false);
const snedForm = ref<HTMLFormElement>(null);
const selectedFile = ref<File | null>(null);
const previewUrl = ref<string | null>("");

// update処理に使う予定
const setDataAction = () => {
	snedForm.value = new snedForm();
	// snedForm.value.append("altText", data.altText || "");
	// snedForm.value.append("caption", data.caption || "");
	// snedForm.value.append("evaluationFactor", String(data.evaluationFactor || "0"));
	// snedForm.value.append("status", data.status || "active");
	// snedForm.value.append("userId", String(data.userId || "1"));
};

const imageSwicherAction = () => {
	fromSwicher.value = !fromSwicher.value;
};

const updateImage = () => {};
</script>

<template>
  <div>
			<div class="DIalog-imager-parts-detail relative">
        <button @click="imageSwicherAction()">{{ $t("detail") }}</button>
        <Transition name="fade">
          <div
            v-if="fromSwicher"
            class="image-uploader__upload-area absolute left-0 bottom-0 p-4 bg-white "
          >
            <form
              class="form"
              @submit.prevent="updateImage"
              ref="snedForm"
            >
              <div class="upload-btn">
                <p class="pb-4">
                  <label class="label inline-block">altText</label>
                  <input type="text" name="altText" class="input">
                </p>
                <p class="pb-4">
                  <label class="label inline-block">caption</label>
                  <input type="text" name="caption" class="input">
                </p>
                <p class="pb-4">
                  <label class="label inline-block">status</label>
                  <input type="text" name="status" class="input">
                </p>
                <button type="submit" :disabled="!selectedFile" class="mt-2 bg-blue-500 text-white p-2 rounded">
                  {{ $t("update") }}
                </button>
              </div>
            </form>
            <button @click="imageSwicherAction()" class="inline-block absolute right-0 top-0 p-2">x</button>
          </div>
        </Transition>
			</div>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
