export const headerOnlyBearer = () => {
	return {
		Authorization: `Bearer ${useCookie("auth_token").value}`,
	};
};

export const headersTypeJson = () => {
	return {
		"Content-Type": "application/json",
		Authorization: `Bearer ${useCookie("auth_token").value}`,
	};
};
