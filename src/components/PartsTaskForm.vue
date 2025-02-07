<script setup lang="ts">
const props = defineProps({
	title: {
		type: String,
		default: "",
	},
	body: {
		type: String,
		default: "",
	},
	evaluationFactor: {
		type: Number,
		default: 0,
	},
});
const emit = defineEmits([
	"changeTitleAction",
	"changeBodyAction",
	"changeEvaluationFactorAction",
]);

const title = ref("");
const body = ref("");
const evaluationFactor = ref(0);

const changeTitleAction = (e: Event) => {
	const titleValue = (e.target as HTMLInputElement).value;
	emit("changeTitleAction", titleValue);
};

const changeBodyAction = (e: Event) => {
	const bodyValue = (e.target as HTMLInputElement).value;
	emit("changeBodyAction", bodyValue);
};

const changeEvaluationFactorAction = (e: Event) => {
	const evaluationFactorValue = Number((e.target as HTMLInputElement).value);
	emit("changeEvaluationFactorAction", evaluationFactorValue);
};

watch(
	() => props.title,
	() => {
		title.value = props.title;
	},
);
watch(
	() => props.body,
	() => {
		body.value = props.body;
	},
);
watch(
	() => props.evaluationFactor,
	() => {
		evaluationFactor.value = props.evaluationFactor;
	},
);
</script>

<template>
  <div class="parts-task-form">
    <div class="pb-2">
      <label class="block text-gray-700 text-sm font-bold mb-2">
        parts title
      </label>
      <input
        type="text"
        v-model="title"
        @keyup="(v:Event) => changeTitleAction(v)"
        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        placeholder="title"
      />
    </div>
    <div class="pb-2">
      <textarea
        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        v-model="body"
        cols="30"
        rows="10"
        @keyup="(v:Event) => changeBodyAction(v)"
        placeholder="description"
      ></textarea>
    </div>
    <div class="pb-2">
      <input
        type="range"
        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        v-model="evaluationFactor"
        min="0"
        max="100"
        step="1"
        @chnage="(v:Event) => changeEvaluationFactorAction(v)"
      />
      {{ evaluationFactor }}
    </div>
  </div>
</template>
