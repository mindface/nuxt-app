<script setup lang="ts">
import { useAuthStore } from "../store/auth";
import type { User } from "../types/User";
const authStore = useAuthStore();
const userLoginSwitch = ref(false);
const loginInfo = reactive({
	email: "",
	password: "",
});
const siginupInfo = reactive({
	name: "",
	email: "",
	password: "",
	detail: "",
	status: "active",
	role: "user",
	isActive: true,
});

const loginAction = () => {
	userLoginSwitch.value = !userLoginSwitch.value;
};

const login = () => {
	authStore.loginUserAction(loginInfo);
};

const signup = async () => {
	authStore.signupUserAction(siginupInfo);
};
// テスト用
const getApi = async () => {
	const response = await $fetch("/api/user", {
		method: "GET",
	});
	console.log(response);
};
</script>

<template>
  <div>
    <div class="info-from">
      <button class="btn" @click="loginAction">{{ userLoginSwitch ? "login pageに変更" : "singnup pageに変更" }}</button>
    </div>
    <div v-if="!userLoginSwitch" class="signup-from">
      <p>email : <input type="text" v-model="loginInfo.email"></p>
      <p>password : <input type="text" v-model="loginInfo.password"></p>
      <button @click="login">singnup</button>
    </div>
    <div v-if="userLoginSwitch" class="login-from">
      <p>name : <input type="text" v-model="siginupInfo.name"></p>
      <p>email : <input type="text" v-model="siginupInfo.email"></p>
      <p>password : <input type="text" v-model="siginupInfo.password"></p>
      <p>detail : <input type="text" v-model="siginupInfo.detail"></p>
      <button @click="signup">login</button>
    </div>
    <button @click="getApi">getApi</button>
  </div>
</template>
