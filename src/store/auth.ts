import dayjs from "dayjs";
import { defineStore } from "pinia";
import type { User } from "../types/User";

export const useAuthStore = defineStore("auth", () => {
	const authUser = ref<User | null>();
	const tokenId = ref("");
	const expiresAt = ref<number | null>(null);
	const authId = ref("");
	const authPass = ref("");

	function setUser(userInfo: User, token: string) {
		authUser.value = userInfo;
		tokenId.value = token;
		console.log(userInfo);
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
		await useFetch("/api/logout");
		navigateTo("/login");
	}

	function getToken() {
		return tokenId.value;
	}

	function startTokenExpirationCheck() {
		const expiresAt = useCookie("auth_expires_at").value;
		if (process.client && expiresAt) {
			setInterval(() => {
				console.log("🔍 クッキーの有効期限を確認中...");
				const expiresAt = Number(useCookie("auth_expires_at").value) || null;
				console.log(
					`⏳ auth_expires_at: ${dayjs(expiresAt).format("YYYY-MM-DD HH:mm:ss")}, 現在時刻: ${dayjs(Date.now()).format("YYYY-MM-DD HH:mm:ss")}`,
				);

				if (expiresAt && Date.now() >= expiresAt) {
					console.log("⚠️ 認証期限が切れました！ログアウト処理を実行します...");
					logoutAuth();
				}
			}, 60 * 100);
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
	};
});
