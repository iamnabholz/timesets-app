import { writable } from 'svelte/store';

export const theme = writable(localStorage.getItem("theme") || "#c90e3b");

export const showHour = writable(JSON.parse(localStorage.getItem("showHour")) || false);
