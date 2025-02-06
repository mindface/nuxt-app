import { defineNuxtPlugin } from "#app";

import { createPinia } from "pinia";
import piniaPersistedState from "pinia-plugin-persistedstate";

export default defineNuxtPlugin((nuxtApp) => {
	const pinia = createPinia();
	pinia.use(piniaPersistedState);
	nuxtApp.vueApp.use(pinia);
});
