export type AppointmentFields = { name: string; phone: string; city: string; need: string }
export type AppointmentErrors = Partial<Record<keyof AppointmentFields, string>>
export type AppointmentLoginDraft = {
  returnUrl: string
  form: AppointmentFields
  regionCode: string
}

export function createAppointmentLoginDraft(
  returnUrl: string,
  form: AppointmentFields,
  regionCode: string,
): AppointmentLoginDraft {
  return {
    returnUrl,
    form: { name: form.name, phone: form.phone, city: form.city, need: form.need },
    regionCode,
  }
}

export function restoreAppointmentLoginDraft(
  value: unknown,
  returnUrl: string,
): Pick<AppointmentLoginDraft, 'form' | 'regionCode'> | null {
  if (!value || typeof value !== 'object') return null
  const draft = value as Partial<AppointmentLoginDraft>
  const form = draft.form as Partial<AppointmentFields> | undefined
  if (
    draft.returnUrl !== returnUrl ||
    !form ||
    typeof form.name !== 'string' ||
    typeof form.phone !== 'string' ||
    typeof form.city !== 'string' ||
    typeof form.need !== 'string' ||
    typeof draft.regionCode !== 'string'
  ) return null
  return {
    form: { name: form.name, phone: form.phone, city: form.city, need: form.need },
    regionCode: draft.regionCode,
  }
}

export function validateAppointment(input: AppointmentFields): AppointmentErrors {
  const errors: AppointmentErrors = {}
  const name = input.name.trim(), city = input.city.trim(), need = input.need.trim()
  if (name.length < 2 || name.length > 20) errors.name = '姓名请输入 2–20 个字'
  if (!/^1[3-9]\d{9}$/.test(input.phone.trim())) errors.phone = '请输入有效的手机号码'
  if (!city) errors.city = '请输入城市'
  if (need.length < 2 || need.length > 300) errors.need = '需求请输入 2–300 个字'
  return errors
}
