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

// VeeValidate 方法載入
import { defineRule, Form, Field, ErrorMessage, configure } from 'vee-validate'
// VeeValidate 規則
import { required, email, min, max } from '@vee-validate/rules'
// VeeValidate 本地化：https://vee-validate.logaretm.com/v4/guide/i18n/
import { localize, setLocale } from '@vee-validate/i18n'
// 匯入 VeeValidate 中文化檔案 -> 只能用小駝峰匯入不能加 '_'
import zhTW from '@vee-validate/i18n/dist/locale/zh_TW.json'

import App from './App.vue'
import router from './router'

// VeeValidate 驗證資料
defineRule('required', required)
defineRule('email', email)
defineRule('min', min)
defineRule('max', max)

// 自定驗證語言跟形式
configure({
  generateMessage: localize({ zh_TW: zhTW }), // 載入繁體中文
  validateOnInput: true // 輸入時驗證
})

// 預設為繁體中文
setLocale('zh_TW')

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(VueAxios, axios)
app.component('VueLoading', Loading)
app.component('VForm', Form)
app.component('VField', Field)
app.component('ErrorMessage', ErrorMessage)
app.mount('#app')
