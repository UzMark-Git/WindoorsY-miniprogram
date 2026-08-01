import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { defineConfig, normalizePath } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'

const appointmentPage = normalizePath(fileURLToPath(
  new URL('./src/pages-sub/appointments/create.vue', import.meta.url),
))
const demoAppointmentPage = fileURLToPath(
  new URL('./src/pages-sub/appointments/create.demo.vue', import.meta.url),
)

export default defineConfig({
  plugins: [
    {
      name: 'local-demo-appointment-page',
      enforce: 'pre',
      load(id) {
        if (
          process.env.VITE_LOCAL_DEMO === 'true' &&
          !id.includes('?') &&
          normalizePath(id.split('?', 1)[0]) === appointmentPage
        ) {
          return readFileSync(demoAppointmentPage, 'utf8')
        }
      },
    },
    uni(),
  ],
})
