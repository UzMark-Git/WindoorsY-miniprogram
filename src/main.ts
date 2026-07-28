import { createSSRApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import { initializeIdentityRuntime } from './config/runtime-bootstrap'

export function createApp() {
  const app = createSSRApp(App)
  app.use(createPinia())
  return { app }
}

void initializeIdentityRuntime()
