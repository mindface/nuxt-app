<script setup lang="ts">
import BaseHeader from "../components/BaseHeader.vue";
</script>

<template>
  <div class="wrapper">
    <BaseHeader />
    <main class="p-2">
      <slot />
    </main>
  </div>
</template>
