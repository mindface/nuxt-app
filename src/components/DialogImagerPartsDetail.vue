<script setup lang="ts">
import { useNuxtApp } from "nuxt/app";
import { ref, type PropType } from "vue";
import { useImagerStore } from "../store/imager";
import type { Imager } from "../types/Imager";

type Item = {
	altText: string;
	caption: string;
	evaluationFactor: number;
	status: string;
	userId: number;
};

const { $toast, $t } = useNuxtApp();

const props = defineProps({
	item: {
		type: Object as PropType<Imager>,
	},
});

const { localUrl } = useRuntimeConfig().app;

const imagerStore = useImagerStore();

const fromSwicher = ref(false);
const snedForm = ref<HTMLFormElement>();

const VModelAltText = ref(props.item?.altText ?? "");
const VModelCaption = ref(props.item?.caption ?? "");
const VModelEvaluationFactor = ref(props.item?.evaluationFactor ?? 0);

const setDataAction = () => {
	console.log(props.item?.altText);
	console.log("---watch2");
	// snedForm.value.append("altText", props.item.altText ?? "default value");
	// snedForm.value.append("caption", data.caption || "");
	// snedForm.value.append("evaluationFactor", String(data.evaluationFactor || "0"));
	// snedForm.value.append("status", data.status || "active");
	// snedForm.value.append("userId", String(data.userId || "1"));
};

const imageSwicherAction = () => {
	fromSwicher.value = !fromSwicher.value;
	if (fromSwicher.value) {
		setDataAction();
	}
};

const downLoadActtion = (url: string) => {
	const path = url.split("/");
	const fileName = path[path.length - 1];
	const a = document.createElement("a");
	document.body.appendChild(a);
	a.download = fileName;
	a.href = url;
	a.click();
	a.remove();
};

const updateImage = async (e: Event) => {
	e.preventDefault();
	const formData = new FormData(snedForm.value);
	if (props.item?.id && props.item?.userId) {
		formData.append("imageId", String(props.item?.id));
		formData.append("typekey", props.item?.typekey ?? "default value");
		formData.append("altText", props.item?.altText ?? "default value");
		formData.append("status", props.item?.status || "active");
		formData.append("userId", String(props.item?.userId));
		try {
			const res = await imagerStore.updateImagerPathAction(formData);
			if (res?.status === 200) {
				$toast.success("imageUpdateSuccess");
			} else {
				$toast.error("imageUpdateError");
			}
		} catch (error) {
			console.error("アップロードエラー:", error);
			$toast.success("imageActionError");
		}
	}
};
</script>

<template>
  <div>
			<div class="dialog-imager-parts-detail relative">
        <button class="p-2 border" @click="imageSwicherAction()">{{ $t("detail") }}</button>
        <button class="p-2 border" @click="downLoadActtion(`${localUrl}${props.item?.path}`)">{{ $t("imageDownload") }}</button>
        <Transition name="fade">
          <div
            v-if="fromSwicher"
            class="image-uploader__upload-area absolute left-0 bottom-0 p-4 bg-white h-[100%]"
          >
            <form
              class="form"
              @submit.prevent="updateImage"
              ref="snedForm"
            >
              <div class="upload-btn">
                <p class="pb-4">
                  <label class="label inline-block">altText</label>
                  <input type="text" name="altText" class="input" v-model="VModelAltText">
                </p>
                <p class="pb-4">
                  <label class="label inline-block">caption</label>
                  <input type="text" name="caption" class="input" v-model="VModelCaption">
                </p>
                <p class="pb-4">
                  <label class="label inline-block">evaluationFactor</label>
                  <input type="range" name="evaluationFactor" class="input" v-model="VModelEvaluationFactor">
                </p>
                <button type="submit" class="mt-2 bg-blue-500 text-white p-2 rounded">
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
