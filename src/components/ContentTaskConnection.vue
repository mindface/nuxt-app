<script setup lang="ts">
import dayjs from "dayjs";
import ja from "dayjs/locale/ja";
import isBetween from "dayjs/plugin/isBetween";
import { storeToRefs } from "pinia";
import { useTaskConnectionStore } from "../store/taskConnection";
import type { TaskConnection } from "../store/taskConnection";

export interface Texter {
	basic_form: string;
	conjugated_form: string;
	conjugated_type: string;
	pos: string;
	pos_detail_1: string;
	pos_detail_2: string;
	pos_detail_3: string;
	pronunciation: string;
	reading: string;
	surface_form: string;
	word_id: number;
	word_position: number;
	word_type: string;
}

dayjs.extend(isBetween);

const selectTitle = ref("");
const resultText = ref();
const title = ref("");
const title02 = ref("");
const body = ref("");
const timeBefore = ref("");
const timeAfter = ref("");
const taskConnectionItems = ref<TaskConnection[]>([]);

dayjs.locale(ja);
const taskConnectionStore = useTaskConnectionStore();
const { taskConnectionList } = storeToRefs(taskConnectionStore);

const setTaskConnectList = () => {
	setTimeout(() => {
		taskConnectionStore.getTaskConnection();
	}, 800);
};

async function copyTextToClipboard(text: string) {
	try {
		await navigator.clipboard.writeText(text);
		console.log("successfully");
	} catch (err) {
		console.error("Failed to copy: ", err);
	}
}

const searchtexter = async () => {
	const result_text = document.createElement("p");
	try {
		const res = await fetch("http://localhost:3003/task/texterActions", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ title: selectTitle.value }),
		});
		const text: { result: Texter[] } = await res.json();
		text.result.forEach((item, index) => {
			const span = document.createElement("span");
			span.className = "clip";
			span.innerHTML =
				item.surface_form + (text.result.length === index + 1 ? "" : " | ");
			span.addEventListener("click", () => {
				copyTextToClipboard(item.surface_form);
			});
			result_text.appendChild(span);
		});
		resultText.value.appendChild(result_text);
	} catch (error) {
		console.log(error);
	}
};

const dayDecision = (itemDay: string) => {
	const _itemDay = dayjs(itemDay).unix();
	const _timeBefore = dayjs(timeBefore.value).unix();
	const _timeAfter = dayjs(timeAfter.value).add(1, "day").unix();
	if (_itemDay > _timeBefore && _itemDay <= _timeAfter) {
		return true;
	}
	// if(dayjs(itemDay).isBetween(timeBefore.value,timeAfter.value,'day')) {
	//   return true
	// }
	return false;
};

const decisionAction = () => {
	const list: TaskConnection[] = [];
	for (const item of taskConnectionList.value) {
		if (title.value !== "" && item.title.indexOf(title.value) > -1) {
			list.push(item);
			continue; // 次のループへ
		}

		for (const connectItem of item.connectList) {
			if (
				title02.value !== "" &&
				connectItem.title.indexOf(title02.value) > -1
			) {
				list.push(item);
				break; // 内側のループを抜ける
			}
		}
	}

	const relist: TaskConnection[] = [];
	list.forEach((item) => {
		if (
			timeBefore.value !== "" &&
			timeAfter.value !== "" &&
			dayDecision(item.created_at)
		) {
			relist.push(item);
			return;
		}
	});

	taskConnectionItems.value = relist;
};

const timeView = (data: string) => {
	const date = new Date(data);
	return dayjs(date).format("YYYYMMDD hh:ss");
};

const timeCheck = (data: string) => {
	const today = dayjs();
	const targetDate = dayjs(data);
	const diff = today.diff(targetDate, "day");
	return diff < 3;
};

const setTaskConnectListAction = async () => {
	setTaskConnectList();
	taskConnectionItems.value = await taskConnectionList.value;
};

onMounted(async () => {
	await taskConnectionStore.getTaskConnection();
	await setTaskConnectListAction();

	timeBefore.value = dayjs().format("YYYY-MM-DD");
	timeAfter.value = dayjs().format("YYYY-MM-DD");
});
</script>

<template>
  <div>
    content task connection
    <div class="search-box">
      <input
        type="text"
        class="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        v-model="selectTitle"
      />
      <button @click="searchtexter">searchtexter</button>
      <div class="result" ref="resultText"></div>      
    </div>
    <div class="task-connection-filter">
      <p class="p-2">title : 
        <input
          type="text"
          class="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          v-model="title"
        />
      </p>
      <p class="p-2">title02 : 
        <input
          type="text"
          class="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          v-model="title02"
        />
      </p>
      <p class="p-2">
        <input
          type="date"
          name=""
          v-model="timeBefore"
        /> ~ 
        <input
          type="date"
          name=""
          v-model="timeAfter"
        />
      </p>
      <p class="p-2">
        <button
          class="bg-sky-300 font-semibold text-white py-2 px-4 rounded"
          @click="setTaskConnectListAction"
        >reload</button>
        <button
          class="bg-sky-300 font-semibold text-white py-2 px-4 rounded"
          @click="decisionAction"
        >set</button>
      </p>
    </div>
    <div class="task-connection-box flex flex-wrap items-start p-2">
      <div
        v-for="taskConnectionItem in taskConnectionItems"
        :key="taskConnectionItem.id"
        class="item relative mb-2 mr-2 p-1 max-w-xs w-full shadow"
      >
       <h5 class="pb-2">{{ taskConnectionItem.title }}</h5>
       <div class="body">{{ taskConnectionItem.body }}</div>
       <div class="time">{{ timeView(taskConnectionItem.created_at) }}</div>
       <div
         v-if="timeCheck(taskConnectionItem.created_at)"
         class="time-check moveUpdown absolute top-1 right-0 text-white p-1 bg-slate-800 leading-none">new
       </div>
       <div class="connections p-2">
        <h5 class="connections-title pb-2">
          <span class="connections-title-sub">コネクションする構造</span>
        </h5>
        <div class="connection-items relative group hover:bg-slate-200" v-for="connectionItem in taskConnectionItem.connectList">
          {{ connectionItem.title }}
          <div class="opacity-0 w-[240px] invisible rounded text-[12px] 
          font-bold text-white p-2 bg-slate-800 top-4 left-3
           group-hover:visible opacity-100 absolute z-30">{{ connectionItem.body }}</div>        
        </div>
       </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.connections-title-sub {
  display: inline-block;
  position: relative;
}
.connections-title-sub::after {
  content: '';
  position: absolute;
  top: 10px;
  left: calc(100% + 4px);
  display: block;
  height: 1px;
  width: 40px;
  background-color: black;
}
.task-connection-box .body {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-height: 1.5;
  height: clamp(3em, 4vw, 3em); /* 例として */
  overflow: hidden;
  overflow: hidden;
}
</style>
