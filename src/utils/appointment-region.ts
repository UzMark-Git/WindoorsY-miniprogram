export const DEFAULT_APPOINTMENT_REGION = Object.freeze({
  code: '360113',
  province: '江西省',
  city: '南昌市',
  district: '红谷滩区',
})

export const APPOINTMENT_REGION_READY_DELAY = 220
const DEFAULT_CITY_CODE = '360100'
const DISTRICT_LEVEL = 2

export type AppointmentRegion = {
  code: string
  province: string
  city: string
  district: string
}

export function selectedAppointmentRegion(value: unknown): AppointmentRegion | null {
  const selected = Array.isArray(value) ? value : []
  if (selected.length < 3) return null
  const province = String(selected[0]?.text || '').trim()
  const city = String(selected[1]?.text || '').trim()
  const district = String(selected[2]?.text || '').trim()
  const code = String(selected[2]?.value || '').trim()
  if (!province || !city || !district || !/^\d{6}$/.test(code)) return null
  return { code, province, city, district }
}

export function formatAppointmentRegion(region: AppointmentRegion) {
  return [region.province, region.city, region.district].join(' ')
}

export function expandAppointmentRegionPicker(picker: any) {
  if (!picker) return false
  picker.selectedIndex = DISTRICT_LEVEL
  const view = picker.$refs?.pickerView
  if (!view) return false
  if (Array.isArray(view.dataList) && view.dataList.length >= 3) {
    view.selectedIndex = DISTRICT_LEVEL
    return true
  }
  const cities = Array.isArray(view.dataList?.[1]) ? view.dataList[1] : []
  const cityIndex = cities.findIndex((item: any) => String(item?.value || '') === DEFAULT_CITY_CODE)
  if (cityIndex < 0 || typeof view.handleNodeClick !== 'function') return false
  view.handleNodeClick(cities[cityIndex], 1, cityIndex)
  return true
}
