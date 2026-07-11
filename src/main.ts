import { createSSRApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import uniIdPageInit from './uni_modules/uni-id-pages/init.js'

export function createApp() {
  const app = createSSRApp(App)
  app.use(createPinia())
  return { app }
}

uniIdPageInit()
