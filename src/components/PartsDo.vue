<script setup lang="ts">
import { ref } from "vue";

const te = ref(false);
const { upstring, uparr } = defineProps(["upstring", "uparr"]);

const addAction = () => {
	te.value = !te.value;
	console.log(uparr);
};
</script>

<template>
  <div>
    parts do
    <div
      v-if="te"
      class="box"
    >on</div>
    <button
      @click="addAction"
    >parts action</button>
    <div class="loop-box p-1">
      <p v-for="item in uparr" class="loop-item">{{ item.title }}</p>
    </div>
    <slot />
  </div>
</template>

<style scoped>

.loop-item {
  margin-bottom: 8px;
  padding: 8px;
  box-shadow: 0 2px 4px 0 rgba(0,0,0,0.16);
}

</style>
