// BS5
import './assets/all.scss'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

// Vue loading
import Loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/css/index.css'

// Vue axios
import axios from 'axios'
import VueAxios from 'vue-axios'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(VueAxios, axios)
app.component('LoadingComponent', Loading)
app.mount('#app')
