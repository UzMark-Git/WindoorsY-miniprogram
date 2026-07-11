import type { AppointmentFields } from '../utils/appointment'

export type AppointmentSourceType = 'store' | 'site' | 'staff' | 'product'
export type CreateAppointmentInput = AppointmentFields & { source_type: AppointmentSourceType; source_id: string; store_id: string }
export type CreateAppointmentResult = { id: string; status: 'pending' }
type AppointmentCloudObject = { create(input: CreateAppointmentInput): Promise<CreateAppointmentResult> }
declare const uniCloud: { importObject(name: string): AppointmentCloudObject }

export const createAppointment = (input: CreateAppointmentInput) => uniCloud.importObject('appointment-co').create(input)
