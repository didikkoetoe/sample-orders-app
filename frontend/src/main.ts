import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import { setupValidation } from './plugins/validation'

setupValidation()
createApp(App).use(router).mount('#app')
