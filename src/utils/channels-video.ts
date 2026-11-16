import type { HomeChannelVideo } from '../types/domain'

export type ChannelsRuntime = {
  openChannelsActivity?: (options: Record<string, unknown>) => void
  showToast: (options: { title: string; icon: 'none' }) => void
  demo: boolean
}

export function openChannelsVideo(video: HomeChannelVideo, runtime: ChannelsRuntime): void {
  if (runtime.demo) {
    runtime.showToast({ title: '演示模式不打开视频号内容', icon: 'none' })
    return
  }
  if (typeof video.finder_user_name !== 'string' || !/^sph[A-Za-z0-9_-]+$/.test(video.finder_user_name)
    || typeof video.feed_id !== 'string' || !video.feed_id.trim()) {
    runtime.showToast({ title: '视频信息不完整，暂时无法打开', icon: 'none' })
    return
  }
  if (!runtime.openChannelsActivity) {
    runtime.showToast({ title: '当前微信版本暂不支持打开视频', icon: 'none' })
    return
  }
  runtime.openChannelsActivity({
    finderUserName: video.finder_user_name,
    feedId: video.feed_id,
    success: () => {},
    fail: () => runtime.showToast({ title: '视频暂时无法打开，请稍后重试', icon: 'none' }),
  })
}
