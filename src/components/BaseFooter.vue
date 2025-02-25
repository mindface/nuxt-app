<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useAuthStore } from "../store/auth";
import DialogImager from "./DialogImager.vue";
const authStore = useAuthStore();
const { authUser } = storeToRefs(authStore);
</script>

<template>
  <footer class="header flex justify-between p-2 bg-sky-300">
    <DialogImager
		  v-if="authUser"
		/>
  </footer>
</template>

<style scoped>
</style>
