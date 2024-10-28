import './assets/main.scss'

import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import router from '@/router'
import {createPinia} from 'pinia'
import { createPersistedState } from 'pinia-persistedstate-plugin'

const app = createApp(App);
const pinia = createPinia();
const persist = createPersistedState();

app.use(ElementPlus);
app.use(router);
pinia.use(persist);
app.use(pinia);
app.mount('#app')
