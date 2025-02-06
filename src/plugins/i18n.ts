import { createI18n } from "vue-i18n";
import { defineNuxtPlugin } from "#app";

import en from "../../locales/en.json";
import ja from "../../locales/ja.json";

export default defineNuxtPlugin(({ vueApp }) => {
	const i18n = createI18n({
		legacy: false,
		globalInjection: true,
		locale: "ja",
		messages: {
			"en-US": en,
			ja,
		},
	});

	vueApp.use(i18n);
});
