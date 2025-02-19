
function getAutxhHeader() {
  return {
		"Content-Type": "application/json",
		Authorization: `Bearer ${useCookie("auth_token").value}`,
	};
}

export function useApi<T>(url: string, async = false, options = {}){
  const headers = getAutxhHeader();

  if(async) {
    return useAsyncData<T>(`api-${url}`, () => $fetch(url, { headers, ...options }));
  } else {
    return useFetch<T>(url, { headers, ...options });
  }
}
