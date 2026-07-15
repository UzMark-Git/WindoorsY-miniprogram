export interface TabBarVisibilityApi {
  hideTabBar(options?: { animation?: boolean }): unknown
  showTabBar(options?: { animation?: boolean }): unknown
}

export interface TabBarScrollState {
  lastTop: number
  upwardDistance: number
  downwardDistance: number
  visible: boolean
}

export const createTabBarScrollState = (): TabBarScrollState => ({
  lastTop: 0,
  upwardDistance: 0,
  downwardDistance: 0,
  visible: true,
})

export function updateTabBarVisibility(state: TabBarScrollState, scrollTop: number): 'show' | 'hide' | null {
  const top = Math.max(0, scrollTop)
  const delta = top - state.lastTop
  state.lastTop = top

  if (top <= 20) {
    state.upwardDistance = 0
    state.downwardDistance = 0
    if (!state.visible) { state.visible = true; return 'show' }
    return null
  }

  if (delta > 0) {
    state.upwardDistance += delta
    state.downwardDistance = 0
    if (state.visible && state.upwardDistance >= 48) { state.visible = false; state.upwardDistance = 0; return 'hide' }
  } else if (delta < 0) {
    state.downwardDistance += -delta
    state.upwardDistance = 0
    if (!state.visible && state.downwardDistance >= 24) { state.visible = true; state.downwardDistance = 0; return 'show' }
  }
  return null
}

export function applyTabBarScroll(state: TabBarScrollState, scrollTop: number, api: TabBarVisibilityApi): void {
  const action = updateTabBarVisibility(state, scrollTop)
  if (action === 'hide') api.hideTabBar({ animation: true })
  if (action === 'show') api.showTabBar({ animation: true })
}

export function resetTabBar(state: TabBarScrollState, api: TabBarVisibilityApi): void {
  Object.assign(state, createTabBarScrollState())
  api.showTabBar({ animation: false })
}
