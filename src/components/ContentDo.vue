<script setup lang="ts">
import { storeToRefs } from "pinia";
import PartsDo from "./PartsDo.vue";

const router = useRouter();
const limiterNumber = ref(0);
const te = ref(5);
const uparr = ref([{ id: 1, title: "title0" }]);

const addAction = () => {
	te.value += 1;
	uparr.value.push({
		id: uparr.value.length + 1,
		title: `title${uparr.value.length + 1}`,
	});
};

const setAction = () => {
	for (let index = 0; index < limiterNumber.value; index++) {
		uparr.value.push({ id: index + 1, title: `title${index + 1}` });
	}
};

const reMove = () => {
	router.go(-1);
};
</script>

<template>
  <div>
    content do
    <div class="limiter-number">
      <input type="number" v-model="limiterNumber" />{{ limiterNumber }}
      <button
        class="bg-indigo-700 font-semibold text-white py-2 px-4 rounded"
        @click="setAction"
      >set</button>
    </div>
    <div class="task-box">
      <button
        class="bg-indigo-700 font-semibold text-white py-2 px-4 rounded"
        @click="addAction"
      >add</button>
    </div>
    <div class="hidtry">
      <button
        class="bg-indigo-700 font-semibold text-white py-2 px-4 rounded"
        @click="reMove"
      >set</button>
    </div>
    <parts-do
      :upstring="te"
      :uparr="uparr"
    >
      <div class="box">test
      </div> 
    </parts-do>
  </div>
</template>
