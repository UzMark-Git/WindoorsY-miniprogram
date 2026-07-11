export function maskPhone(phone: string): string {
  return /^(\d{3})\d{4}(\d{4})$/.test(phone)
    ? phone.replace(/^(\d{3})\d{4}(\d{4})$/, '$1****$2')
    : phone
}
