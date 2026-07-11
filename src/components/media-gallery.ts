export function createVideoCoordinator(stop: (id: string) => void) {
  let active: string | undefined
  return {
    play(id: string) {
      if (active && active !== id) stop(active)
      active = id
    },
    unload() {
      if (active) stop(active)
      active = undefined
    },
  }
}

export const isVideoMedia = (src: string) => /\.(mp4|mov|m4v|webm)(?:[?#]|$)/i.test(src)
