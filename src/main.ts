import { createApp } from 'vue'

import { registerPlugins } from '@/plugins'

import App from './App.vue'

import 'unfonts.css'
import router from "@/routes.ts";

const app = createApp(App).use(router)

registerPlugins(app)

app.mount('#app')
