import { useAuthStore } from "../store/auth";

export default defineNuxtPlugin(() => {
	const authStore = useAuthStore();

	function handleAuthError(error: any) {
		if (error.response?.status === 401) {
			authStore.logoutAuth();
		}
	}

	return {
		provide: {
			fetch: async <T>(
				url: string,
				options: Parameters<typeof $fetch>[1] = {},
			): Promise<T> => {
				try {
					options.headers = {
						...(options.headers as Record<string, string>),
						Authorization: `Bearer ${authStore.logoutAuth()}`,
					};

					if (options.method) {
						options.method = options.method.toUpperCase() as NonNullable<
							Parameters<typeof $fetch>[1]
						>["method"];
					}

					const response = await $fetch<T>(url, options);
					return response as T;
				} catch (error: any) {
					handleAuthError(error);
					throw error;
				}
			},
			useFetch: <T>(
				url: string,
				options?: Parameters<typeof useFetch<T>>[1],
			) => {
				return useFetch<T>(url, {
					...options,
					headers: {
						...(options?.headers as Record<string, string>),
						Authorization: `Bearer ${authStore.logoutAuth()}`,
					},
					onResponseError({ response }) {
						handleAuthError(response);
					},
				});
			},
		},
	};
});
