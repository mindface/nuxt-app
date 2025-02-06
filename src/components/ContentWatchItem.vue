<script setup lang="ts">
import { storeToRefs } from "pinia";
import { getData04, getData06 } from "../lib/resas-api";
import { useTaskStore } from "../store/task";

const runtimeConfig = useRuntimeConfig();
interface AreaInfo {
	prefCode: number;
	prefName: string;
}

interface IndustryInfo {
	sicCode: string;
	sicName: string;
}

interface IndustryMdlInfo {
	simcCode: string;
	sicCode: string;
	simcName: string;
}

interface CityInfo {
	bigCityFlag: string;
	cityCode: string;
	cityName: string;
	prefCode: number;
}

interface CompaniesInfo {
	cityCode: string;
	cityName: string;
	data: { year: number; value: number }[];
	prefCode: string;
	prefName: string;
	sicCode: string;
	sicName: string;
	simcCode: string;
	simcName: string;
}

const yearlist = [
	{ id: 1, year: "2014" },
	{ id: 2, year: "2015" },
	{ id: 3, year: "2016" },
	{ id: 4, year: "2017" },
	{ id: 5, year: "2018" },
	{ id: 6, year: "2019" },
	{ id: 7, year: "2020" },
];

const searchText = ref("");
const title = ref("");
const areaVaule = ref(0);
const cityVaule = ref("");
const industryVaule = ref("");
const industryMdlVaule = ref("");
const yearVaule = ref("2014");
const totalCityVaule = ref<any[]>([]);
const headers = computed(() => ({
	"X-API-KEY": runtimeConfig.app.apiKey ?? "",
}));

const store = useTaskStore();
const { taskList } = storeToRefs(store);
const areaInfoList = ref<AreaInfo[]>([]);
const cityInfoList = ref<CityInfo[]>([]);
const industryInfoList = ref<IndustryInfo[]>([]);
const companiesInfo = ref<CompaniesInfo>();
const industryMdlInfoList = ref<IndustryMdlInfo[]>([]);
const addTaskAction = () => {
	const item = {
		id: taskList.value.length + 1,
		title: title.value,
		body: "",
	};
	// store.addTask(item)
};

onMounted(async () => {
	// store.getTask()
});

const getData = async () => {
	const reData04 = await getData04(areaVaule.value);
	const reData = await getData06(areaVaule.value);
	getData05();
};

const getAreaData = async () => {
	const { data: result01 } = await useFetch(
		"https://opendata.resas-portal.go.jp/api/v1/prefectures",
		{
			method: "GET",
			headers,
		},
	);
	if (!result01.value) return;
	const { message, result } = result01.value as {
		message: string;
		result: AreaInfo[];
	};
	areaInfoList.value = result;
};

const getCityData = async () => {
	const url =
		"https://opendata.resas-portal.go.jp/api/v1/cities" +
		`?prefCode=${areaVaule.value}`;
	const { data: result01 } = await useFetch(url, {
		method: "GET",
		headers,
	});
	const { message, result } = result01.value as {
		message: string;
		result: CityInfo[];
	};
	cityInfoList.value = result;
};

const getIndustryData = async () => {
	const url = "https://opendata.resas-portal.go.jp/api/v1/industries/broad";
	const { data: result01 } = await useFetch(url, {
		method: "GET",
		headers,
	});
	const { message, result } = result01.value as {
		message: string;
		result: IndustryInfo[];
	};
	industryInfoList.value = result;
};

const getIndustryMdlData = async () => {
	const url =
		"https://opendata.resas-portal.go.jp/api/v1/industries/middle" +
		`?sicCode=${industryVaule.value}`;
	const { data: result01 } = await useFetch(url, {
		method: "GET",
		headers,
	});
	const { message, result } = result01.value as {
		message: string;
		result: IndustryMdlInfo[];
	};
	industryMdlInfoList.value = result;
};

const getCompanyNumberData = async () => {
	const url =
		"https://opendata.resas-portal.go.jp/api/v1/municipality/company/perYear" +
		`?prefCode=${areaVaule.value}` +
		`&cityCode=${cityVaule.value}` +
		`&sicCode=${industryVaule.value}` +
		`&simcCode=${industryMdlVaule.value}`;
	const { data: result01 } = await useFetch(url, {
		method: "GET",
		headers,
	});
	const { message, result } = result01.value as {
		message: string;
		result: CompaniesInfo;
	};
	companiesInfo.value = result;
};

const changeCity = (event: Event) => {
	const element = event.target as HTMLInputElement;
	cityInfoList.value.forEach((item) => {
		if (item.cityCode === element.value) {
			cityVaule.value = item.cityCode;
		}
	});
};

const getData05 = async () => {
	const url =
		"https://opendata.resas-portal.go.jp/api/v1/population/sum/estimate" +
		`?cityCode=-` +
		`&prefCode=${areaVaule.value}`;
	const { data: result01 } = await useFetch(url, {
		method: "GET",
		headers,
	});
	if (result01.value) {
		const { message, result } = result01.value as any;
		console.log(result);
		totalCityVaule.value = result.data[0].data;
	}
};

/** 現象情報化--------------------- */

const selectIds = ref<number[]>([]);
const selectFirst = ref<{ year: number; value: number }>({ year: 0, value: 0 });
const selectSecond = ref<{ year: number; value: number }>({
	year: 0,
	value: 0,
});
const calcNumber = ref(0);

const selectAction = (event: Event, year: number, hNumber: number) => {
	const element = event.target as HTMLInputElement;
	if (element.checked) {
		selectIds.value = [...selectIds.value, year];
	} else if (!element.checked) {
		selectIds.value = selectIds.value.filter((item) => item !== year);
	}

	if (selectIds.value.length === 0 && !element.checked) {
		selectFirst.value = { year: 0, value: 0 };
	}
	if (selectIds.value.length === 1) {
		selectFirst.value = { year, value: hNumber };
		if (!element.checked) {
			selectSecond.value = { year: 0, value: 0 };
		}
	} else if (selectIds.value.length === 2) {
		selectSecond.value = { year, value: hNumber };
	}
};

const calcAction = () => {
	const num =
		(selectFirst.value!.value ?? 0) - (selectSecond.value?.value ?? 0);
	calcNumber.value = num;
};

const searchAction = () => {
	window.open(`https://www.google.com/search?q=${searchText.value}`, "_blank");
};

onMounted(async () => {
	await getAreaData();
	await getIndustryData();
});
</script>

<template>
  <div class="p-2">
    content watch item
    <div class="search-box pb-8">
      <input
        type="text"
        v-model="searchText"
        class="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
      />
      <button
        class="bg-sky-300 font-semibold text-white py-2 px-4 rounded"
        @click="searchAction">search</button>
    </div>
    <div class="watch-box flex bg-sky-300">
      <div class="watch-box-population max-w-xs">
        <h3 class="title">人口分布</h3>
        <div class="p-4">
          <select
            v-model="areaVaule"
            @change="() => getCityData()"
          >
            <option
              v-for="item in areaInfoList"
              :key="item.prefCode"
              :value="item.prefCode"
            >{{ item.prefName }}</option>
          </select>
          <select
            v-if="areaVaule !== 0"
            @change="($event) => changeCity($event)"
          >
            <option
              v-for="item in cityInfoList"
              :key="item.cityCode"
              :value="item.cityCode"
            >{{ item.cityName }}</option>
          </select>
          <select v-model="yearVaule">
            <option v-for="item in yearlist" :key="item.year" :value="item.year" >{{ item.year }}</option>
          </select>
        </div>
        <div class="field">
          <div class="totak-city">
            <div class="flex">
              <div class="box ml-4 p-2 bg-white">
                <h4>引かれる {{ selectFirst?.year === 0 ? '' : selectFirst?.year }}</h4>
                <div class="select-wrap p-2">
                  <p v-for="item in totalCityVaule">
                    <label class="label">
                      <input
                        v-if="selectIds.length < 1 || selectIds.includes(item.year)"
                        type="checkbox"
                        :checked="selectIds.includes(item.year)"
                        @change="($event) => selectAction($event,item.year,item.value)"
                      >
                      {{ item.year }} | {{ item.value }}
                    </label>
                  </p>
                </div>
              </div>
              <div class="box p-2 bg-white">
                <h4>引く {{ selectSecond?.year === 0 ? '' : selectSecond?.year }}</h4>
                <div v-if="selectIds.length >= 1" class="select-wrap p-2">
                  <p v-for="item in totalCityVaule">
                    <label class="label" >
                      <input
                        v-if="selectIds.length < 2 || selectIds.includes(item.year)"
                        type="checkbox"
                        :checked="selectIds.includes(item.year)"
                        @change="($event) => selectAction($event,item.year,item.value)"
                      />
                      {{ item.year }} | {{ item.value }}
                    </label>
                  </p>
                </div>
              </div>
            </div>
            <div v-if="selectIds.length === 2" class="p-4 actions">
              <button
                class="bg-indigo-700 font-semibold text-white py-2 px-4 rounded"
                @click="calcAction"
              >calc</button>
              <span v-if="(calcNumber * -1) < 0">減少傾向</span>
              <span v-if="(calcNumber * -1) > 0">増加傾向</span>
              {{ calcNumber * -1 }}
            </div>
          </div>
          <p class="p-4">
            <button
              class="bg-white font-semibold py-2 px-4 rounded"
              @click="getData"
            >getCityData</button>
          </p>
        </div>
        <div class="watch-box-industry max-w-xs">
          <div class="p-4">
            <select
              v-model="industryVaule"
              @change="() => getIndustryMdlData()"
            >
              <option
                v-for="item in industryInfoList"
                :key="item.sicCode"
                :value="item.sicCode"
              >{{ item.sicName }}</option>
            </select>
            <select
              v-model="industryMdlVaule"
            >
              <option
                v-for="item in industryMdlInfoList"
                :key="item.simcCode"
                :value="item.simcCode"
              >{{ item.simcName }}</option>
            </select>
            <div class="pt-2">
              <button
                class="bg-white font-semibold py-2 px-4 rounded"
                @click="getCompanyNumberData"
              >getCompanyNumberData</button>
            </div>
            <div class="result">
              <p>年 | 企業数</p>
              <p v-for="item in companiesInfo?.data">{{ item.year }} | {{ item.value }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="task-box p-2">
      <div class="control-box ">
        <div class="p-2 pb-4">
          <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="title">
              title
            </label>
            <input
              type="text"
              id="title"
              v-model="title"
              class="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="title"
            />
          </div>
          <button
            class="bg-sky-300 font-semibold text-white py-2 px-4 rounded"
            @click="addTaskAction">add</button>
        </div>
      </div>
      <div class="flex flex-wrap">
        <div 
          v-for="item in taskList"
          :key="item.id"
          class="item mb-2 mr-2 p-1 max-w-xs w-full shadow sticky"
        >
        <h5 class="pb-2">{{ item.title }}</h5>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.select-wrap {
  position: relative;
  max-height: 220px;
  width: 220px;
  overflow: auto;
}

.lll {
  position: absolute;
  bottom: 0;
  z-index: 1;
  /* opacity: 0;
  animation-name: rotateAnimation;
  animation-duration: 1ms;
  animation-direction: alternate;
  animation-timeline: scroll(block nearest); */
  background-color: #efefef;
}

.select-wrap .label:hover {
  background-color: #efefef;
}

@keyframes rotateAnimation {
  0% {
    opacity: 0;
  }
  3% {
    opacity: 0.3;
  }
  5% {
    opacity: 0.8;
  }
  8% {
    opacity: 1;
  }
  100% {
    opacity: 1;
    background-color: #ccc;
  }
}
</style>
