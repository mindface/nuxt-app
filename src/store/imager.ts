import { defineStore } from "pinia";
import { ref } from "vue";
import type { ImagerCreateResponse, ImagerResponse } from "../types/ApiRespose";
import type { Imager } from "../types/Imager";
import { headersTypeJson } from "../utils/headers-helper";

export const useImagerStore = defineStore("imager", () => {
	const imager = ref<Imager | null>();
	const imagerLinst = ref<Imager[]>([]);

	async function getImagerPathAction(userId: number) {
		try {
			const response = (await $fetch(`/api/imager?userId=${userId}`, {
				method: "GET",
				headers: headersTypeJson(),
			})) as ImagerResponse;
			if (response.status === 201) {
				imagerLinst.value = response.images;
				return { message: "success" };
			} else if (response.status === 500) {
				return { message: "Internal Server Error" };
			}
		} catch (error) {
			console.log(error);
			return { message: "error" };
		}
	}

	async function addImagerPathAction(formData: FormData) {
		try {
			const res = (await $fetch("/api/upload", {
				method: "POST",
				headers: headersTypeJson(),
				body: formData,
			})) as ImagerCreateResponse;
			if (res.status === 201) {
				return { status: res.status, message: "imageUploadSuccess" };
			} else {
				return { status: res.status, message: "imageUploadError" };
			}
		} catch (error) {
			console.log(error);
		}
	}

	async function updateImagerPathAction(formData: FormData) {
		try {
			const res = (await $fetch("/api/imager", {
				method: "PUT",
				headers: headersTypeJson(),
				body: formData,
			})) as ImagerCreateResponse;
			if (res.status === 200) {
				return { status: res.status, message: "imageUploadSuccess" };
			} else {
				return { status: res.status, message: "imageUploadError" };
			}
		} catch (error) {
			console.log(error);
		}
	}

	async function deleteImagerPathAction(deleteId: number) {
		try {
			const data = await $fetch(`/api/upload?id=${deleteId}`, {
				method: "DELETE",
			});
			console.log(data);
		} catch (error) {
			console.error(error);
		}
	}

	return {
		imagerLinst,
		getImagerPathAction,
		addImagerPathAction,
		updateImagerPathAction,
		deleteImagerPathAction,
	};
});
