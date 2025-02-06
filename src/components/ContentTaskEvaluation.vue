<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useAuthStore } from "../store/auth";
import { useTaskStore } from "../store/task";

const title = ref("");
const body = ref("");

const taskStore = useTaskStore();
const authStore = useAuthStore();
const { taskList } = storeToRefs(taskStore);
const { authUser } = storeToRefs(authStore);

const addTaskAction = () => {
	// const item = {
	//   title: title.value,
	//   userId: authUser.value?.id
	// }
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
	useAsyncData("fetchkey", () =>
		$fetch("http://localhost:3003/base/create", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ body: title.value }),
		}).then((res) => {
			console.log(res);
		}),
	);
};

onMounted(async () => {
	// if(authUser.value?.id) {
	//   taskStore.getTask(authUser.value?.id)
	// }
});
</script>

<template>
  <div>
    content task evaluation
    <div class="add-task-box max-w-xs">
      <div class="field">
        <div class="p-2">
          <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="title">
              title
            </label>
            <input
              type="text"
              v-model="title"
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="title"
            />
          </div>
        </div>
        <div class="p-2">
          <textarea
            v-model="body"
            cols="30"
            rows="10"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          ></textarea>
        </div>
        <p><button @click="addTaskAction">add</button></p>
        <p><button @click="postDataAction">express</button></p>
      </div>
    </div>
  </div>
</template>
