import { loadAutoSave } from "@/core/save-load/save-load.js";
import { createApp } from 'vue';
import App from './App.vue';

createApp(App).mount('#app');

loadAutoSave();