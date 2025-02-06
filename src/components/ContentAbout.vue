<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useCounterStore } from "../store/counter";

const router = useRouter();

const store = useCounterStore();
const addAction = () => {
	store.increment();
};
const reMove = () => {
	router.go(-1);
};
</script>

<template>
  <div>
    content task
    <div class="task-box">
      <button
        class="bg-indigo-700 font-semibold text-white py-2 px-4 rounded"
        @click="addAction"
      >add</button>
      {{ store.count }}
    </div>
    <div class="hidtry">
      <button
        class="bg-indigo-700 font-semibold text-white py-2 px-4 rounded"
        @click="reMove"
      >set</button>
    </div>
  </div>
</template>
