<script setup lang="ts">
import { useI18n } from "vue-i18n";
const { t, locale } = useI18n();
import ContentTask from "../components/ContentTask.vue";
import { useAuthStore } from "../store/auth";
const route = useRoute();

const menuSwitch = ref(false);
const authStore = useAuthStore();

const logoutAction = () => {
	authStore.logoutAuth();
	navigateTo({ path: "/login" });
};

const pathList = [
	{
		path: "/",
		pathName: "home",
	},
	{
		path: "/about",
		pathName: "about",
	},
	{
		path: "/task",
		pathName: "task",
	},
	{
		path: "/view3d",
		pathName: "view3d",
	},
	{
		path: "/viewModel",
		pathName: "viewModeler",
	},
	{
		path: "/taskConnect",
		pathName: "taskConnect",
	},
	{
		path: "/taskConnection",
		pathName: "taskConnection",
	},
	{
		path: "/watchItem",
		pathName: "watchItem",
	},
	{
		path: "/do",
		pathName: "do",
	},
	{
		path: "/user",
		pathName: "user",
	},
];
</script>

<template>
  <header class="header flex justify-between p-2 bg-sky-300">
    <div class="menu-icon">
      <div class="icon" @click="menuSwitch = !menuSwitch">
        <span class="icon-item"></span>
        <span class="icon-item"></span>
        <span class="icon-item"></span>
      </div>
    </div>
    <h1>{{ t('hello', { name: 'vue-i18n' }) }}</h1>
    <form>
      <label for="locale-select">{{ t('language') }}: </label>
      <select id="locale-select" v-model="locale">
        <option value="en-US">en</option>
        <option value="ja">ja</option>
      </select>
    </form>
    <div v-if="menuSwitch" class="menu-box fixed z-10">
      <ul class="bg-white p-1 shadow">
        <li v-for="item in pathList" :key="item.pathName">
          <NuxtLink :to="item.path" class="inline-block p-1 ">{{ item.pathName }}</NuxtLink>
        </li>
      </ul>
    </div>
    <button
      v-if="route.fullPath !== '/login' && authStore"
      class="bg-sky-300 font-semibold text-white py-2 px-4 rounded"
      @click="logoutAction"
    >Logout</button>
  </header>
</template>

<style scoped>
.menu-box {
  top: 46px;
}
.icon {
  position: relative;
  height: 40px;
  width: 40px;
  margin-right: 8px;
  cursor: pointer;
}
.icon:hover .icon-item {
  top: 24px;
}
.icon-item {
  position: absolute;
  left: 2px;
  top: 8px;
  height: 1px;
  width: 36px;
  background-color: #fff;
  transition: 0.3s top;
}
.icon-item:nth-child(2) {
  top: 18px;
}
.icon-item:nth-child(3) {
  top: 28px;
}
</style>
