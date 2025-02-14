import dayjs from "dayjs";
import { defineStore } from "pinia";
import type { User, AddUser } from "../types/User";
import type { UserResponse } from "../types/ApiRespose";

let tokenCheckInterval: NodeJS.Timeout | null = null;

export const useAuthStore = defineStore("auth", () => {
	const authUser = ref<User | null>();
	const tokenId = ref("");
	const expiresAt = ref<number | null>(null);
	const authId = ref("");
	const authPass = ref("");

	function setUser(userInfo: User, token: string) {
		authUser.value = userInfo;
		tokenId.value = token;
		useCookie("auth_user").value = JSON.stringify(userInfo);
		useCookie("auth_token").value = token;
		expiresAt.value = Date.now() + 3600 * 1000;
		useCookie("auth_expires_at").value = String(expiresAt.value);
		startTokenExpirationCheck();
	}

	function setAuth(loginId: string, loginPass: string) {
		localStorage.setItem("id", loginId);
		localStorage.setItem("pass", loginPass);
		authId.value = loginId;
		authPass.value = loginPass;
	}

	async function logoutAuth() {
		useCookie("auth_token").value = null;
		useCookie("auth_expires_at").value = null;
		useCookie("auth_user").value = null;
		authUser.value = null;
		tokenId.value = "";
		await $fetch("/api/logout");
		navigateTo("/login");
		if (tokenCheckInterval) {
			clearInterval(tokenCheckInterval);
			tokenCheckInterval = null;
		}
	}

	function getToken() {
		return tokenId.value;
	}

	async function loginUserAction(siginupInfo: {
		email: string;
		password: string;
	}) {
		try {
			const response = (await $fetch("/api/login", {
				method: "POST",
				body: {
					email: siginupInfo.email,
					password: siginupInfo.password,
				},
			})) as { user: User; status: number; token: string };
			console.log(response);
			if (response.status === 201) {
				setUser(response.user, response.token);
				navigateTo({ path: "/" });
				return { message: "success" };
			} else if (response.status === 500) {
				return { message: "Internal Server Error" };
			}
		} catch (error) {
			console.log(error);
			return { message: "error" };
		}
	}

	async function signupUserAction(loginInfo: AddUser) {
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
	}

	async function updateUserAction(updateUser: User) {
		try {
			const data = await $fetch<UserResponse>(
				`/api/user?id=${authUser.value?.id}`,
				{
					method: "PUT",
					body: updateUser,
				},
			);
			if (data) {
				authUser.value = data.user;
				useCookie("auth_user").value = JSON.stringify(data.user);
			}
		} catch (error) {
			console.error(error);
		}
	}

	async function deleteUserAction() {
		try {
			const data = await $fetch(`/api/user?id=${authUser.value?.id}`, {
				method: "DELETE",
			});
			console.log(data);
		} catch (error) {
			console.error(error);
		}
	}

	function startTokenExpirationCheck() {
		if (tokenCheckInterval) {
			clearInterval(tokenCheckInterval);
		}
		const expiresAt = useCookie("auth_expires_at").value;
		if (process.client && expiresAt) {
			tokenCheckInterval = setInterval(() => {
				console.log("🔍 クッキーの有効期限を確認中...");
				const expiresAt = Number(useCookie("auth_expires_at").value) || null;
				console.log(
					`⏳ auth_expires_at: ${dayjs(expiresAt).format("YYYY-MM-DD HH:mm:ss")}, 現在時刻: ${dayjs(Date.now()).format("YYYY-MM-DD HH:mm:ss")}`,
				);

				if (expiresAt && Date.now() >= expiresAt) {
					console.log("⚠️ 認証期限が切れました！ログアウト処理を実行します...");
					logoutAuth();
				}
			}, 60 * 1000);
		}
	}

	return {
		authUser,
		tokenId,
		setUser,
		authId,
		authPass,
		setAuth,
		logoutAuth,
		getToken,
		loginUserAction,
		signupUserAction,
		updateUserAction,
		deleteUserAction,
		startTokenExpirationCheck,
	};
});
