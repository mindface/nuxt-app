<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useImagerStore } from "../store/imager";
import { useAuthStore } from "../store/auth";
import { useNuxtApp } from "nuxt/app";

import Dialog from "./parts/Dialog.vue";
// import DialogImagerPartsDetail from "./DialogImagerPartsDetail.vue";

const { $t } = useNuxtApp();

const imagerStore = useImagerStore();
const authStore = useAuthStore();
const { imagerLinst } = storeToRefs(imagerStore);
const { authUser } = storeToRefs(authStore);

const imageSwicher = ref(false);
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
	imageSwicher.value = !imageSwicher.value;
};

const previewImage = (event: Event): void => {
	const target = event.target as HTMLInputElement;
	const file = target.files ? target.files[0] : null;
	if (!file) return;
	selectedFile.value = file;

	const reader = new FileReader();
	reader.onload = (e) => {
		previewUrl.value = e.target?.result as string;
	};
	reader.readAsDataURL(file);
};

const uploadImage = async (e: Event) => {
	e.preventDefault();
	console.log(authUser.value);
	if (!snedForm.value) return;
	const formData = new FormData(snedForm.value);
	formData.append("userId", authUser.value.id);
	try {
		imagerStore.addImagerPathAction(formData);
	} catch (error) {
		console.error("アップロードエラー:", error);
	}
};

onMounted(() => {
	imagerStore.getImagerPathAction(authUser.value.id);
});
</script>

<template>
  <div>
		<Dialog
		  :label="$t('imageList')"
		>
			<div class="image-uploader">
				<button class="btn" @click="imageSwicherAction">{{ imageSwicher ? $t('imageList'):$t('imageUpload') }}</button>
				<div
          v-if="imageSwicher"
          class="image-uploader__upload-area"
        >
          <form
            class="form"
            @submit.prevent="uploadImage"
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
                アップロード
              </button>
            </div>
            <div class="upload-image">
              <input type="file" name="file" @change="previewImage" accept="image/*" />
              <img v-if="previewUrl" :src="previewUrl" alt="Preview" class="w-40 h-40 object-cover mt-2" />
            </div>
          </form>
				</div>
				<div
          v-else
          class="image-uploader__image-list flex flex-wrap"
        >
          <div
            class="image-box"
            v-for="(item,index) in imagerLinst"
            :key="`nuxt-img${index}`"
          >
            <div class="image-box__inner">
              <nuxt-img
                :src="`http://localhost:3000${item.path}`"
                width="220"
                height="120"
                quality="70"
                class="inline-block"
              ></nuxt-img>
              <DialogImagerPartsDetail />
            </div>
          </div>
				</div>
			</div>
		</Dialog>
  </div>
</template>

<style scoped>
</style>
