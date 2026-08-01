import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { defineConfig, loadEnv, normalizePath } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'

const miniprogramRoot = fileURLToPath(new URL('.', import.meta.url))
const appointmentPage = normalizePath(fileURLToPath(
  new URL('./src/pages-sub/appointments/create.vue', import.meta.url),
))
const demoAppointmentPage = fileURLToPath(
  new URL('./src/pages-sub/appointments/create.demo.vue', import.meta.url),
)

export default defineConfig(({ mode }) => {
  const localDemo = loadEnv(mode, miniprogramRoot, '').VITE_LOCAL_DEMO === 'true'

  return {
    plugins: [
      {
        name: 'local-demo-appointment-page',
        enforce: 'pre',
        load(id) {
          if (
            localDemo &&
            !id.includes('?') &&
            normalizePath(id.split('?', 1)[0]) === appointmentPage
          ) {
            return readFileSync(demoAppointmentPage, 'utf8')
          }
        },
      },
      uni(),
    ],
  }
})
