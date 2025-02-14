<script setup lang="ts">
import Dialog from "./parts/Dialog.vue";
const { $t } = useNuxtApp();

const editSwitch = ref(false);
const label = ref("");
const industry = ref("");

const dialogLavel = $t("AddTag");

const props = defineProps({
	switch: {
		type: Boolean,
		defalt: false,
	},
});

const addTagAction = () => {
	const addEvaluationTag = {
		label: label.value,
		industry: industry.value,
	};
	// taskStore.addTask(item)
};

const postDataAction = async () => {
	// const res = await fetch("http://localhost:3003/base/create", {
	//   method: "POST",
	//   headers: {
	//     "Content-Type": "application/json"
	//   },
	//   body: JSON.stringify({ body: "tttt" })
	// })
	// const result = await res.json()
};

const submitActcion = () => {};

onMounted(async () => {
	// if(authUser.value?.id) {
	//   taskStore.getTask(authUser.value?.id)
	// }
});
</script>

<template>
  <Dialog :label="dialogLavel">
    <template #header>
      <div class="dialog-header">
        <h3 class="title">{{ $t("DialogAddTaskEvaluationTitle") }}</h3>
      </div>
    </template>
    <template #default>
      <div class="dialog-main">
        <form @submit.stop="submitActcion" class="form">
          <div class="field">
            <div class="pt-8 pb-2">
              <label class="block">label</label>
              <input type="text" class="p-2" v-model="label">
            </div>
            <div class="pb-2">
              <label class="block">industry</label>
              <input type="text" class="p-2" v-model="industry">
            </div>
          </div>
        </form>
      </div>
    </template>
    <template #footer>
      <footer class="footer">
        <h4 class="title">footer</h4>
      </footer>
    </template>
  </Dialog>
</template>
