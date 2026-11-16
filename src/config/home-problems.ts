export type HomeProblemType =
  | 'street_noise' | 'balcony_enclosure' | 'thermal_comfort' | 'kitchen_ventilation'
  | 'child_safety' | 'high_rise_wind' | 'rainy_humidity' | 'west_sun'
  | 'old_window_renewal' | 'panoramic_window' | 'sliding_ventilation' | 'insect_screen'

export type HomeProblemDefinition = {
  type: HomeProblemType; title: string; subtitle: string; keyword: string
}

export const HOME_PROBLEMS = [
  { type: 'street_noise', title: '临街噪音', subtitle: '重点隔音', keyword: '隔音封窗' },
  { type: 'balcony_enclosure', title: '阳台封窗', subtitle: '安全采光', keyword: '阳台封窗' },
  { type: 'thermal_comfort', title: '冬冷夏热', subtitle: '保温隔热', keyword: '保温隔热' },
  { type: 'kitchen_ventilation', title: '厨卫闷热', subtitle: '通风防雨', keyword: '通风防雨' },
  { type: 'child_safety', title: '儿童安全', subtitle: '防护防坠', keyword: '儿童安全' },
  { type: 'high_rise_wind', title: '高层风压', subtitle: '结构稳定', keyword: '高层封窗' },
  { type: 'rainy_humidity', title: '梅雨潮湿', subtitle: '密封防水', keyword: '密封防水' },
  { type: 'west_sun', title: '日晒西晒', subtitle: '遮阳隔热', keyword: '遮阳隔热' },
  { type: 'old_window_renewal', title: '旧窗改造', subtitle: '拆换更新', keyword: '旧窗改造' },
  { type: 'panoramic_window', title: '大景观窗', subtitle: '视野采光', keyword: '景观窗' },
  { type: 'sliding_ventilation', title: '推拉通风', subtitle: '开启顺畅', keyword: '推拉窗' },
  { type: 'insect_screen', title: '纱窗防蚊', subtitle: '通风防虫', keyword: '纱窗' },
] as const satisfies readonly HomeProblemDefinition[]

export const homeProblemPages = () => [0, 4, 8].map(start => HOME_PROBLEMS.slice(start, start + 4))
