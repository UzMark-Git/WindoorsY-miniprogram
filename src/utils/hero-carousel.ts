export function normalizeHeroImages(values: unknown, placeholder: string) {
  const images = Array.isArray(values)
    ? values.map(value => String(value ?? '').trim()).filter(Boolean)
    : []
  return images.length ? images : [placeholder]
}

export function markHeroImageFailed(state: Record<number, boolean>, index: number) {
  return { ...state, [index]: true }
}

export function resolveHeroImage(
  images: string[],
  failed: Record<number, boolean>,
  index: number,
  placeholder: string,
) {
  return failed[index] ? placeholder : images[index] || placeholder
}
