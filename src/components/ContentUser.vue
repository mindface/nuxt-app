<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useAuthStore } from "../store/auth";
import { TimeHelper } from "../utils/time-helper";

const authStore = useAuthStore();
const { authUser } = storeToRefs(authStore);
const userInfo = reactive({
	name: "",
	email: "",
	detail: "",
});
const userUpdateSwitch = ref(false);

const lastLoginValue = computed({
	get: () =>
		authUser.value ? TimeHelper.basicChangeTime(authUser.value.lastLogin) : "",
	set: (val: Date) => {
		if (authUser.value) {
			authUser.value.lastLogin = val;
		}
	},
});
const createdAtValue = computed({
	get: () =>
		authUser.value ? TimeHelper.basicChangeTime(authUser.value.createdAt) : "",
	set: (val: Date) => {
		if (authUser.value) {
			authUser.value.createdAt = val;
		}
	},
});
const updatedAtValue = computed({
	get: () =>
		authUser.value ? TimeHelper.basicChangeTime(authUser.value.updatedAt) : "",
	set: (val: Date) => {
		if (authUser.value) {
			authUser.value.updatedAt = val;
		}
	},
});

const updateUserSwitchAction = () => {
	userUpdateSwitch.value = !userUpdateSwitch.value;
};

const updateUserAction = async () => {
	const updateUser = {
		...authUser.value,
		name: userInfo.name,
		email: userInfo.email,
		detail: userInfo.detail,
	};
	try {
		const data = await $fetch(`/api/user?id=${authUser.value?.id}`, {
			method: "PUT",
			body: updateUser,
		});
		console.log(data);
	} catch (error) {
		console.error(error);
	}
};

const deleteUserAction = async () => {
	if (confirm("この操作は取り消せません。実行しますか。")) {
		try {
			const data = await $fetch(`/api/user?id=${authUser.value?.id}`, {
				method: "DELETE",
			});
			console.log(data);
		} catch (error) {
			console.error(error);
		}
	}
};

onMounted(() => {
	userInfo.name = authUser.value?.name ?? "";
	userInfo.email = authUser.value?.email ?? "";
	userInfo.detail = authUser.value?.detail ?? "";
});
</script>

<template>
  <div>
    <div class="user-info">
      <div class="update-btn-area">
        <button class="btn" @click.stop="updateUserSwitchAction">{{ userUpdateSwitch ? "確認" : "更新" }}</button>
      </div>
      <form @submit.prevent="updateUserAction">
        <div class="field">
          <label for="name">名前</label>
          <span v-if="!userUpdateSwitch">{{ userInfo.name }}</span>
          <input v-else type="text" id="name" name="name" v-model="userInfo.name" />
        </div>
        <div class="field">
          <label for="email">メールアドレス</label>
          <span v-if="!userUpdateSwitch">{{ userInfo.email }}</span>
          <input v-else type="email" id="email" name="email" v-model="userInfo.email" />
        </div>
        <div class="field">
          <label for="detail">詳細</label>
          <span v-if="!userUpdateSwitch">{{ userInfo.detail }}</span>
          <input v-else type="text" id="detail" name="detail" v-model="userInfo.detail" />
        </div>
        <div class="field">
          <label for="status">状態</label>
          <span>{{ authUser?.status }}</span>
        </div>
        <div class="field">
          <label for="role">役割</label>
          <span>{{ authUser?.role }}</span>
        </div>
        <div class="field">
          <label for="isActive">アクティブ</label>
          <span>{{ authUser?.isActive ? "有効" : "無効" }}</span>
        </div>
        <div class="field">
          <label for="lastLogin">最終ログイン</label>
          <span v-if="!userUpdateSwitch">{{ TimeHelper.basicChangeTime(authUser?.lastLogin) }}</span>
          <input v-else type="text" id="lastLogin" name="lastLogin" v-model="lastLoginValue" disabled />
        </div>
        <div class="field">
          <label for="createdAt">作成日</label>
          <span v-if="!userUpdateSwitch">{{ TimeHelper.basicChangeTime(authUser?.createdAt) }}</span>
          <input v-else type="text" id="createdAt" name="createdAt" v-model="createdAtValue" disabled />
        </div>
        <div class="field">
          <label for="updatedAt">更新日</label>
          <span v-if="!userUpdateSwitch">{{ TimeHelper.basicChangeTime(authUser?.updatedAt) }}</span>
          <input v-else type="text" id="updatedAt" name="updatedAt" v-model="updatedAtValue" disabled />
        </div>
        <button v-if="userUpdateSwitch" type="submit">送信</button>
      </form>
    </div>
  </div>
</template>


<style scoped>
form {
  max-width: 400px;
  margin: 20px auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
div {
  display: flex;
  flex-direction: column;
}
label {
  font-weight: bold;
  margin-bottom: 0.3rem;
}
input[type="text"],
input[type="email"] {
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}
input[disabled] {
  background-color: #ccc;
}
button {
  padding: 0.7rem;
  background-color: #3490dc;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
button:hover {
  background-color: #2779bd;
}
</style>