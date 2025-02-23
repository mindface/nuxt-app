import { toRaw } from "vue";
import { defineNuxtRouteMiddleware } from "#app";
import { useAuthStore } from "../store/auth";
import type { User } from "../types/User";

export default defineNuxtRouteMiddleware((to, from) => {
	const authStore = useAuthStore();
	const token = useCookie("auth_token").value;
	const userCookie = useCookie("auth_user").value;

	if (userCookie) {
		try {
			const userInfo = toRaw(userCookie) as unknown as User;
			authStore.setUser(userInfo, token ?? "");
		} catch (e) {
			console.error("ユーザー情報の解析に失敗しました:", e);
		}
	}
	// token情報がない場合、ログインページにリダイレクト
	if (!token) {
		// リダイレクトを防ぐ
		if (to.path === "/login") {
			return;
		}
		authStore.logoutAuth();
		return navigateTo("/login");
	}

	// if (to.path === '/') {
	//   return navigateTo('/login')
	// }
});
