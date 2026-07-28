import { assertCloudRuntime } from '../config/demo-isolation'

export type EditableSite = { _id:string; store_id:string; title:string }
export type EditableStaff = { _id:string; store_id:string; name:string }
export type SiteUpdateDraft = { occurred_at:string; stage:string; title:string; content:string; quality_tags:string[]; next_step:string; media:string[]; staff_ids:string[] }

// The public detail page calls this API to determine whether the current user
// may maintain construction updates. Let callers handle authorization errors
// instead of showing uniCloud's default modal to ordinary customers.
const cloud = () => {
  assertCloudRuntime('施工动态管理')
  return uniCloud.importObject('content-admin-co', { customUI: true })
}
export async function getSiteUpdateEditorOptions():Promise<{sites:EditableSite[];staff:EditableStaff[];scope:string}> { return cloud().mobileSiteUpdateOptions() }
export async function createSiteUpdateDraft(site_id:string,data:SiteUpdateDraft):Promise<{id:string;status:'draft'}> { return cloud().createMobileSiteUpdate({site_id,data}) }
export async function uploadSiteUpdateImage(filePath:string,cloudPath:string):Promise<{fileID?:string}> {
  assertCloudRuntime('施工图片上传')
  return uniCloud.uploadFile({filePath,cloudPath})
}
