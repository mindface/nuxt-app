import { defineStore } from "pinia";
import { headerOnlyBearer } from "../utils/headers-helper";
import type { Imager, AddImager } from "../types/Imager";
import type { ImagerResponse, ImagerCreateResponse } from "../types/ApiRespose";

export const useImagerStore = defineStore("imager", () => {
	const imager = ref<Imager | null>();
	const imagerLinst = ref<Imager[]>([]);

	async function getImagerPathAction(userId: number) {
		try {
			const response = await $fetch<ImagerResponse>(
				`/api/imager?userId=${userId}`,
				{
					method: "GET",
					headers: headerOnlyBearer(),
				},
			);
			console.log(response);
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
			const response = await $fetch<ImagerCreateResponse>("/api/upload", {
				method: "POST",
				headers: headerOnlyBearer(),
				body: formData,
			});
			console.log(response);
			// if (response.status === 201) {
			// 	alert("アップロード成功: " + response);
			// } else {
			// 	alert("エラー: " + result);
			// }
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
		deleteImagerPathAction,
	};
});
