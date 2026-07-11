export type SiteMeta = { area?: number; district?: string }

export function formatSiteMeta({ area, district }: SiteMeta): string {
  return [area == null ? '' : `${area}㎡`, district?.trim() ?? ''].filter(Boolean).join(' · ')
}
