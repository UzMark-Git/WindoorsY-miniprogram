export const DEMO_MODE_LABEL = '演示数据' as const

type RuntimeEnv = {
  VITE_LOCAL_DEMO?: string
}

export function isLocalDemoMode(env: RuntimeEnv = import.meta.env) {
  return env.VITE_LOCAL_DEMO === 'true'
}
