import { defineNuxtPlugin } from "#app";
import { useAuthStore } from "../store/auth";

export default defineNuxtPlugin(({ vueApp }) => {
	const authStore = useAuthStore();

	function resetTokenExpirationCheck() {
		authStore.startTokenExpirationCheck();
	}

	if (process.client) {
		window.addEventListener("mousemove", resetTokenExpirationCheck);
		window.addEventListener("keydown", resetTokenExpirationCheck);
	}
});
