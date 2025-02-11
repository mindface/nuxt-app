import { defineNuxtPlugin } from "#app";
import { useToast } from "vue-toast-notification";
import "vue-toast-notification/dist/theme-default.css";

export default defineNuxtPlugin((_nuxtApp) => {
	return {
		provide: {
			toast: useToast({
				position: "top-right",
				duration: 4000,
			}),
		},
	};
});
