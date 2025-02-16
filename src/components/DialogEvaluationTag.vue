<script setup lang="ts">
import Dialog from "./parts/Dialog.vue";
import { useEvaluationTagStore } from "../store/evaluationTag";
import { storeToRefs } from "pinia";
const { $t } = useNuxtApp();
const evaluationTagStore = useEvaluationTagStore();
const { tagList } = storeToRefs(evaluationTagStore);

const editSwitch = ref(false);
const label = ref("");
const industry = ref("");
const key = ref("");

const dialogAddBtn = $t("AddButton");
const dialogLavel = $t("AddTag");
const dialogTagList = $t("DialogTagList");
const dialogTagForm = $t("DialogTagForm");
const confirmDeletion = $t("confirmDeletion");

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

const submitActcion = (event: Event) => {
	event.preventDefault();
	const addEvaluationTag = {
		key: key.value,
		label: label.value,
		industry: industry.value,
	};
	console.log(addEvaluationTag);
	// evaluationTagStore.addEvaluationTag(addEvaluationTag);
};

const deleteTagAction = (tagId: number) => {
	if (confirm(confirmDeletion)) {
		evaluationTagStore.deleteEvaluationTag(tagId);
	}
};
const changePanelAction = () => {
	editSwitch.value = !editSwitch.value;
};

onMounted(async () => {
	evaluationTagStore.getEvaluationTagList();
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
        <div class="dialog-evaluation-btn pt-4">
          <button
            @click="changePanelAction"
            class="border"
          >{{ editSwitch ? dialogTagList : dialogTagForm }}</button>
        </div>
        <div class="dialog-evaluation-add" v-if="editSwitch">
          <form @submit.stop="submitActcion" class="form">
            <div class="field">
              <div class="pt-8 pb-2">
                <label class="block">key</label>
                <input type="text" class="p-2" v-model="key">
              </div>
              <div class="pb-2">
                <label class="block">label</label>
                <input type="text" class="p-2" v-model="label">
              </div>
              <div class="pb-2">
                <label class="block">industry</label>
                <input type="text" class="p-2" v-model="industry">
              </div>
              <div class="pb-2">
                <button type="button" class="p-2">{{ dialogAddBtn }}</button>
              </div>
            </div>
          </form>
        </div>
        <div class="dialog-evaluation-list" v-else>
          <ul>
            <li
              class="dialog-evaluation-item"
              v-for="item in tagList"
              :key="item.id"
            >
              <div class="flex">
                <div class="label">{{ item.label }}</div>
                <button class="btn" @click="deleteTagAction(item.id)">delete</button>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </template>
    <template #footer>
      <footer class="footer p-4">
        <h4 class="footer__title">DialogEvaluationTag</h4>
      </footer>
    </template>
  </Dialog>
</template>
