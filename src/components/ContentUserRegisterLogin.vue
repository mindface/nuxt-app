<script setup lang="ts">
import { useAuthStore } from "../store/auth";
import Dialog from "./parts/Dialog.vue";
const { $toast, $t } = useNuxtApp();
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

const loginSwitchAction = () => {
	userLoginSwitch.value = !userLoginSwitch.value;
};

const login = async () => {
	const res = await authStore.loginUserAction(loginInfo);
	if (res && res.message === "success") {
		$toast.success($t("login"));
	} else if (res && res.message === "Internal Server Error") {
		$toast.error($t("NotLogin"));
	}
};

const signup = async () => {
	authStore.signupUserAction(siginupInfo);
};
const rawMessage = ref("hello from parent component!");

const message = computed(() => {
	return rawMessage.value.toUpperCase();
});
provide("message", message);
</script>

<template>
  <div>
    <div class="info-from">
      <button class="btn switcher" @click="loginSwitchAction">{{ userLoginSwitch ? "login pageに変更" : "singnup pageに変更" }}</button>
    </div>
    <div v-if="!userLoginSwitch" class="login-from">
      <p>email : <input type="text" class="input email" v-model="loginInfo.email"></p>
      <p>password : <input type="text" class="input password" v-model="loginInfo.password"></p>
      <button @click="login">singnup</button>
    </div>
    <div v-if="userLoginSwitch" class="signup-from">
      <p>name : <input type="text" class="input name" v-model="siginupInfo.name"></p>
      <p>email : <input type="text" class="input email" v-model="siginupInfo.email"></p>
      <p>password : <input type="text" class="input password" v-model="siginupInfo.password"></p>
      <p>detail : <input type="text" class="input detail" v-model="siginupInfo.detail"></p>
      <button @click="signup">login</button>
    </div>
  </div>
</template>
