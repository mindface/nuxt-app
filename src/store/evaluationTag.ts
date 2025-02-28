import { defineStore } from "pinia";
import type { EvaluationTagResponse } from "../types/ApiRespose";
import type { AddEvaluationTag, EvaluationTag } from "../types/EvaluationTag";
import { headersTypeJson } from "../utils/headers-helper";

export const useEvaluationTagStore = defineStore("EvaluationTag", () => {
	const tagList = ref<EvaluationTag[]>([]);

	async function getEvaluationTagList() {
		try {
			const data = (await $fetch("/api/evaluationTag", {
				method: "GET",
				headers: headersTypeJson(),
			})) as EvaluationTagResponse;
			if (data) {
				tagList.value = data.tags ?? [];
			}
		} catch (error) {
			console.error(error);
		}
	}
	async function addEvaluationTag(addEvaluationTag: AddEvaluationTag) {
		try {
			const data = (await $fetch("/api/evaluationTag", {
				method: "POST",
				headers: headersTypeJson(),
				body: JSON.stringify(addEvaluationTag),
			})) as EvaluationTagResponse;
		} catch (error) {
			console.error(`error`, error);
		}
	}
	async function updateEvaluationTag(tagItem: EvaluationTag) {
		try {
			const data = (await $fetch("/api/evaluationTag", {
				method: "PUT",
				headers: headersTypeJson(),
				body: JSON.stringify(tagItem),
			})) as EvaluationTagResponse;
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
