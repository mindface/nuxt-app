import dayjs from "dayjs";
import ja from "dayjs/locale/ja";
import isBetween from "dayjs/plugin/isBetween";

dayjs.extend(isBetween);
dayjs.locale(ja);

export class TimeHelper {
	private static instance: TimeHelper;
	private constructor() {}

	static basicChangeTime(data: Date | undefined | null) {
		if (!data) return "";
		const date = new Date(data);
		return dayjs(date).format("YYYYMMDD hh:ss");
	}
}
