import { defineStore } from 'pinia'
export const useMyStore = defineStore('my-store', {
    state: () => ({
        currentOption: 'settings'
    }),
    actions: {
        setCurrentOption(option: string) {
            this.currentOption = option;
        }
    }
});