import { createApp } from 'vue';
import { createPinia } from 'pinia';
import AppShell from './AppShell.vue';
import '../../../css/studio-tokens.css';

createApp(AppShell).use(createPinia()).mount('#studio-app');
