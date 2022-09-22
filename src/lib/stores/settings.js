import { writable } from 'svelte/store';

export const theme = writable(localStorage.getItem("theme") || "#CB2A37");

export const currentView = writable(localStorage.getItem("view") || "pomo");

export const showHour = writable(JSON.parse(localStorage.getItem("showHour")) || false);