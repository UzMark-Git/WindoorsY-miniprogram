export type ProgressState = 'completed' | 'active' | 'pending'

export function mapProgress(stages: string[], current: number) {
  if (!stages.length) return []
  const active = Math.min(stages.length - 1, Math.max(0, Math.trunc(current)))
  return stages.map((label, index) => ({
    label,
    state: index < active ? 'completed' as const : index === active ? 'active' as const : 'pending' as const,
  }))
}
