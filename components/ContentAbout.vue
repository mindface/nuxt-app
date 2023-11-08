<script setup lang="ts">
import { onMounted } from 'vue';
import { storeToRefs } from 'pinia'
import { useCounterStore } from '../store/counter';

const store = useCounterStore()
onMounted(() => {
  console.log(store.count)
})
const addAction = () => {
  store.increment();
}
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
  </div>
</template>
