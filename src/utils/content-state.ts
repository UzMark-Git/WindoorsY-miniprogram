export type LoadState<T> =
  | { status: 'loading' }
  | { status: 'ready'; data: T }
  | { status: 'empty'; data: T }
  | { status: 'error'; message: string }
  | { status: 'offline'; message: string }

export function toLoadState<T>(data: T[]): LoadState<T[]> {
  return data.length ? { status: 'ready', data } : { status: 'empty', data }
}
