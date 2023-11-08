import { defineStore, acceptHMRUpdate } from 'pinia'

export interface Task {
  id: string;
  title: string;
  body: string;
}

export const useTaskStore = defineStore('task', () => {
  const taskList = ref<Task[]>([
    {
      id: 'id01',
      title: 't01',
      body: 'b01',
    }
  ])

  function addTask(task: Task) {
    console.log(task)
    taskList.value = [...taskList.value,task]
  }
  async function getTask() {
    const res = await fetch('http://localhost:3003/base')
    const items = await res.json()
    taskList.value = items ?? []
  }
  return { taskList, getTask, addTask }
})