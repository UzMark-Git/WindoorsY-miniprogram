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
    release(ids: string[]) {
      if (active && ids.includes(active)) {
        stop(active)
        active = undefined
      }
    },
  }
}

export const isVideoMedia = (src: string) => /\.(mp4|mov|m4v|webm)(?:[?#]|$)/i.test(src)

let gallerySequence = 0
export function createGalleryId() { return `media-gallery-${++gallerySequence}` }

export const pageVideoCoordinator = createVideoCoordinator(id => uni.createVideoContext(id).stop())
