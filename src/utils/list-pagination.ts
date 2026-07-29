export const PRIMARY_LIST_PAGE_SIZE = 2

export function mergeListPage<T extends { _id: string }>(
  current: T[],
  incoming: T[],
  reset: boolean,
): T[] {
  const values = reset ? incoming : [...current, ...incoming]
  return [...new Map(values.map(item => [item._id, item])).values()]
}

export function hasMoreListPages(received: number, pageSize: number): boolean {
  return received === pageSize
}
