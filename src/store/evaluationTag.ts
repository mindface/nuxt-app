import { defineStore } from "pinia";
import type { AddEvaluationTag, EvaluationTag } from "../types/EvaluationTag";
import type { EvaluationTagResponse } from "../types/ApiRespose";

export const useEvaluationTagStore = defineStore("EvaluationTag", () => {
	const tagList = ref<EvaluationTag[]>([]);
	const headers = {
		"Content-Type": "application/json",
		Authorization: `Bearer ${useCookie("auth_token").value}`,
	};

	async function getEvaluationTagList() {
		try {
			const data = await $fetch<EvaluationTagResponse>("/api/evaluationTag", {
				method: "GET",
				headers: headers,
			});
			if (data) {
				tagList.value = data.tags ?? [];
			}
		} catch (error) {
			console.error(error);
		}
	}
	async function addEvaluationTag(addEvaluationTag: AddEvaluationTag) {
		try {
			const data = await $fetch<EvaluationTagResponse>("/api/evaluationTag", {
				method: "POST",
				headers: headers,
				body: JSON.stringify(addEvaluationTag),
			});
		} catch (error) {
			console.error(`error`, error);
		}
	}
	async function updateEvaluationTag(tagItem: EvaluationTag) {
		try {
			const data = await $fetch<EvaluationTagResponse>("/api/evaluationTag", {
				method: "PUT",
				headers: headers,
				body: JSON.stringify(tagItem),
			});
		} catch (error) {
			console.error("error", error);
		}
	}
	async function deleteEvaluationTag(tagId: number) {
		try {
			const data = await useFetch<EvaluationTagResponse>(
				`/api/evaluationTag/${tagId}`,
				{
					method: "DELETE",
				},
			);
		} catch (error) {
			console.error("error", error);
		}
	}

	return {
		tagList,
		addEvaluationTag,
		updateEvaluationTag,
		deleteEvaluationTag,
		getEvaluationTagList,
	};
});
