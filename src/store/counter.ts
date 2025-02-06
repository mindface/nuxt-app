import { acceptHMRUpdate, defineStore } from "pinia";

export const useCounterStore = defineStore("counterStore", {
	state: () => ({
		count: 0,
	}),
	getters: {
		doubleCount: (state) => state.count * 2,
	},
	actions: {
		increment() {
			this.count++;
		},
	},
});
