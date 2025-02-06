<script setup lang="ts">
import { useAuthStore } from "../store/auth";
import type { User } from "../types/User";
const { authUser, setUser } = useAuthStore();
const userLoginSwitch = ref(false);
const siginupInfo = reactive({
	email: "",
	password: "",
});
const loginInfo = reactive({
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

const login = async () => {
	const response = (await $fetch("/api/login", {
		method: "POST",
		body: {
			email: siginupInfo.email,
			password: siginupInfo.password,
		},
	})) as { user: User; status: number; token: string };
	setUser(response.user, response.token);
	navigateTo({ path: "/" });
};

const signup = async () => {
	const response = await $fetch("/api/user", {
		method: "POST",
		body: {
			name: loginInfo.name,
			email: loginInfo.email,
			password: loginInfo.password,
			detail: loginInfo.detail,
			status: "active",
			role: "user",
			isActive: true,
		},
	});
	console.log(response);
};
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
      <p>email : <input type="text" v-model="siginupInfo.email"></p>
      <p>password : <input type="text" v-model="siginupInfo.password"></p>
      <button @click="login">singnup</button>
    </div>
    <div v-if="userLoginSwitch" class="login-from">
      <p>name : <input type="text" v-model="loginInfo.name"></p>
      <p>email : <input type="text" v-model="loginInfo.email"></p>
      <p>password : <input type="text" v-model="loginInfo.password"></p>
      <p>detail : <input type="text" v-model="loginInfo.detail"></p>
      <button @click="signup">login</button>
    </div>
    <button @click="getApi">getApi</button>
  </div>
</template>
