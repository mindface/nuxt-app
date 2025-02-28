<script setup lang="ts">
import { useNuxtApp } from "nuxt/app";
import { storeToRefs } from "pinia";
import { ref } from "vue";
import { useAuthStore } from "../store/auth";
import { useImagerStore } from "../store/imager";
import Dialog from "./parts/Dialog.vue";
// import DialogImagerPartsDetail from "./DialogImagerPartsDetail.vue";

const { $toast, $t } = useNuxtApp();

const imagerStore = useImagerStore();
const authStore = useAuthStore();
const { imagerLinst } = storeToRefs(imagerStore);
const { authUser } = storeToRefs(authStore);

const imageSwicher = ref(false);
const snedForm = ref<HTMLFormElement | null>(null);
const selectedFile = ref<File | null>(null);
const previewUrl = ref<string | null>("");

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
	if (!snedForm.value) return;
	const formData = new FormData(snedForm.value);
	formData.append("userId", String(authUser.value?.id));
	try {
		const res = await imagerStore.addImagerPathAction(formData);
		if (res?.status === 201) {
			$toast.success("imageUploadSuccess");
		} else {
			$toast.success("imageUploadError");
		}
	} catch (error) {
		console.error("アップロードエラー:", error);
		$toast.success("imageActionError");
	}
};

onMounted(() => {
	if (authUser.value?.id) {
		imagerStore.getImagerPathAction(authUser.value?.id);
	}
});
</script>

<template>
  <div>
		<Dialog
		  :label="$t('imageList')"
		>
			<div class="image-uploader h-[80vh]">
        <p class="p-4">
          <button class="btn p-2 border" @click="imageSwicherAction">{{ imageSwicher ? $t('imageList'):$t('imageUpload') }}</button>
        </p>
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
              <DialogImagerPartsDetail
                :item="item"
              />
            </div>
          </div>
				</div>
			</div>
		</Dialog>
  </div>
</template>

<style scoped>
</style>
