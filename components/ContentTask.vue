<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useTaskStore } from '../store/task';

const title = ref('')
const body = ref('')

const store = useTaskStore()
const { taskList } = storeToRefs(store)

const addTaskAction = () => {
  const item = {
    id: `id0${taskList.value.length + 1}`,
    title: title.value,
    body: body.value
  }
  store.addTask(item)
}

const postDataAction = async () => {
  const res = await fetch('http://localhost:3003/base/create', {
    method: 'POST',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ body: "tttt" })
  })
  const result = await res.json()
  console.log(result)
}

onMounted(() => {
  store.getTask()
})

</script>

<template>
  <div>
    content task
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
    <div class="task-box flex flex-wrap p-2">
      <div 
        v-for="item in taskList"
        :key="item.id"
        class="item mb-2 mr-2 p-1 max-w-xs w-full shadow sticky"
      >
       <h5 class="pb-2">{{ item.title }}</h5>
       <div class="body">{{ item.body }}</div>
      </div>
    </div>
    <div class="sticky" style="top: 30px;">pppp</div>
    <div class="inline-flex bg-gray-200" style="top: 0;">
      <div class="flex-1 text-gray-700 text-center bg-gray-400 px-4 py-2 m-2">1</div>
      <div class="flex-1 text-gray-700 text-center bg-gray-400 px-4 py-2 m-2">2</div>
      <div class="flex-1 text-gray-700 text-center bg-gray-400 px-4 py-2 m-2">3</div>
    </div>
    <div v-for="item in [1,2,3,4,5,6,7]" class="bg-gray-200 p-4">
      <img class="float-right mr-4 my-2 h-32" src="https://images.unsplash.com/photo-1459262838948-3e2de6c1ec80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=80">
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam venenatis et lorem sit amet vehicula. Etiam vel nibh nec nisi euismod mollis ultrices condimentum velit. Proin velit libero, interdum ac rhoncus sit amet, pellentesque ac turpis. Quisque ac luctus turpis, vel efficitur ante. Cras convallis risus vel vehicula dapibus. Donec eget neque fringilla, faucibus mi quis, porttitor magna. Cras pellentesque leo est, et luctus neque rutrum eu. Aliquam consequat velit sed sem posuere, vitae sollicitudin mi consequat. Mauris eget ipsum sed dui rutrum fringilla. Donec varius vehicula magna sit amet auctor. Ut congue vehicula lectus in blandit. Vivamus suscipit eleifend turpis, nec sodales sem vulputate a. Curabitur pulvinar libero viverra, efficitur odio eu, finibus justo. Etiam eu vehicula felis.</p>
    </div>
  </div>
</template>
