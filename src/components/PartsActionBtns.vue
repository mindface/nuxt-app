<script setup lang="ts">
const emit = defineEmits(["viewAction", "updateAction", "deleteAction"]);

const viewAction = () => {
	emit("viewAction");
};

const updateAction = () => {
	emit("updateAction");
};

const deleteAction = () => {
	emit("deleteAction");
};
</script>

<template>
  <div class="actions flex">
    <p class="pr-2">
      <button
        class="bg-sky-300 font-semibold text-white py-2 px-4 rounded"
        @click="viewAction"
      >
        view
      </button>
    </p>
    <p class="pr-2">
      <button
        class="bg-sky-300 font-semibold text-white py-2 px-4 rounded"
        @click="updateAction"
      >
        update
      </button>
    </p>
    <p>
      <button
        class="bg-gray-300 font-semibold text-white py-2 px-4 rounded"
        @click="deleteAction"
      >
        delete
      </button>
    </p>
  </div>
</template>
