export type ServiceEntryMode = 'all' | 'construction' | 'warranty'

let pendingMode: Exclude<ServiceEntryMode, 'all'> | undefined

export function setPendingServiceEntryMode(mode: Exclude<ServiceEntryMode, 'all'>) {
  pendingMode = mode
}

export function consumePendingServiceEntryMode(): ServiceEntryMode {
  const mode = pendingMode ?? 'all'
  pendingMode = undefined
  return mode
}
