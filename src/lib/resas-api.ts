const headers = computed(() => ({
	"X-API-KEY": "6HkKf6zXIQ9g5U7nD8nGvh4enznFY6ASV8qCIC57",
}));

export const getData01 = async () => {
	const url =
		"https://opendata.resas-portal.go.jp/api/v1/population/composition/pyramid" +
		"?prefCode=1" +
		"&cityCode=-" +
		"&yearLeft=1980" +
		"&yearRight=2025";
	const { data: result01 } = await useFetch(url, {
		method: "GET",
		headers,
	});
	if (result01.value) {
		const { message, result } = result01.value as any;
		console.log(result);
		return result;
	}
};

export const getData02 = async () => {
	const url =
		"https://opendata.resas-portal.go.jp/api/v1/population/composition/pyramid" +
		"?prefCode=1" +
		"&cityCode=-" +
		"&yearLeft=1980" +
		"&yearRight=2025";
	const { data: result01 } = await useFetch(url, {
		method: "GET",
		headers,
	});
	if (result01.value) {
		const { message, result } = result01.value as any;
		console.log(result);
		return result;
	}
};

export const getData03 = async () => {
	const url = "https://opendata.resas-portal.go.jp/api/v1/regions/broad";
	const { data: result01 } = await useFetch(url, {
		method: "GET",
		headers,
	});
	if (result01.value) {
		const { message, result } = result01.value as any;
		return result;
	}
};

export const getData04 = async (areaVaule: number) => {
	const { data: result01 } = await useFetch(
		"https://opendata.resas-portal.go.jp/api/v1/population/society/forArea" +
			`?prefCode=${areaVaule}`,
		{
			method: "GET",
			headers,
		},
	);
	if (result01.value) {
		const { message, result } = result01.value as any;
		return result;
	}
};

export const getData06 = async (areaVaule: number) => {
	const { data: result01 } = await useFetch(
		"https://opendata.resas-portal.go.jp/api/v1/forestry/income/forStacked" +
			`?prefCode=${areaVaule}` +
			`&cityCode=-`,
		{
			method: "GET",
			headers,
		},
	);
	if (result01.value) {
		const { message, result } = result01.value as any;
		return result;
	}
};
