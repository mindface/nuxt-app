<script setup lang="ts">
import { ref, inject } from "vue";
const dialogRef = ref<HTMLDialogElement>();
const isOpen = ref(false);
const props = defineProps({
	label: {
		type: String,
		defalt: "view",
	},
});
const openDialogAction = () => {
	isOpen.value = true;
	setTimeout(() => {
		if (dialogRef.value) dialogRef.value.showModal();
	}, 50);
};
const closeDialogAction = () => {
	if (dialogRef.value) {
		dialogRef.value.close();
		isOpen.value = false;
	}
};
const hideDialog = () => {
	isOpen.value = false;
};
</script>

<template>
  <div>
    <button @click="openDialogAction">{{ props.label }}</button>
    <teleport to="body">
      <Transition name="bounce" mode="out-in" @after-leave="hideDialog">
        <dialog ref="dialogRef" class="dialog max-w-[80vw] w-[80vw]">
          <div class="p-4">
            <header class="header p-2 bg-sky-300">
              <slot name="header"></slot>
            </header>
            <main class="main">
              <slot></slot>
            </main>
            <footer class="footer">
              <slot name="footer"></slot>
              <button @click="closeDialogAction">close</button>
            </footer>
          </div>
        </dialog>
      </Transition>
    </teleport>
  </div>
</template>

<style scoped>
/* .dialog {
  border: none;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition-behavior: allow-discrete;
} */
/* .fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
} */
dialog[open] {
  opacity: 1;
  transform: scaleY(1);
}
dialog {
  opacity: 0;
  transform: scaleY(0);
  transition:
    opacity 0.7s ease-out,
    transform 0.7s ease-out,
    overlay 0.7s ease-out allow-discrete,
    display 0.7s ease-out allow-discrete;
}
@starting-style {
  dialog[open] {
    opacity: 0;
    transform: scaleY(0);
  }
}
</style>
