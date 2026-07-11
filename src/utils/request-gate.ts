export function createRequestGate() {
  let sequence = 0
  let loadingMore = false

  return {
    beginReset() {
      loadingMore = false
      return ++sequence
    },
    beginMore() {
      if (loadingMore) return undefined
      loadingMore = true
      return ++sequence
    },
    isCurrent(request: number) {
      return request === sequence
    },
    finish(request: number) {
      if (request === sequence) loadingMore = false
    },
  }
}
