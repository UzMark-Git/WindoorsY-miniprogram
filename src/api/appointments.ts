import type { AppointmentFields } from '../utils/appointment'
import { assertCloudRuntime } from '../config/demo-isolation'

export type AppointmentSourceType = 'store' | 'site' | 'staff' | 'product'
export type CreateAppointmentInput = AppointmentFields & { source_type: AppointmentSourceType; source_id: string; store_id: string }
export type CreateAppointmentResult = { id: string; status: 'pending' }
export type AppointmentStatus='pending'|'contacted'|'visited'|'won'|'closed'
export type MineAppointment={_id:string;store_id:string;source_type:AppointmentSourceType;source_id:string;status:AppointmentStatus;created_at:number;updated_at:number}
export type MineAppointmentDetail=MineAppointment&{name:string;phone:string;city:string;note:string;status_history:Array<{from:AppointmentStatus;to:AppointmentStatus;note:string;at:number}>}
type AppointmentCloudObject = { create(input: CreateAppointmentInput): Promise<CreateAppointmentResult>;listMine(input:{page:number;pageSize:number}):Promise<{items:MineAppointment[];page:number;pageSize:number}>;getMineDetail(input:{id:string}):Promise<MineAppointmentDetail> }
declare const uniCloud: { importObject(name: string, options?: { customUI?: boolean }): AppointmentCloudObject }

const cloud = () => {
  assertCloudRuntime('预约与账号数据')
  return uniCloud.importObject('appointment-co', { customUI: true })
}
export const createAppointment = (input: CreateAppointmentInput) => cloud().create(input)
export const listMineAppointments=(page=1,pageSize=10)=>cloud().listMine({page,pageSize})
export const getMineAppointment=(id:string)=>cloud().getMineDetail({id})
