import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import './style.css'
import { createPinia } from 'pinia'
import 'primeicons/primeicons.css'

createApp(App).use(createPinia()).mount('#app')
