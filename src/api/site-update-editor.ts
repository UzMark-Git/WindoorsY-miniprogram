export type EditableSite = { _id:string; store_id:string; title:string }
export type EditableStaff = { _id:string; store_id:string; name:string }
export type SiteUpdateDraft = { occurred_at:string; stage:string; title:string; content:string; quality_tags:string[]; next_step:string; media:string[]; staff_ids:string[] }

const cloud = () => uniCloud.importObject('content-admin-co')
export async function getSiteUpdateEditorOptions():Promise<{sites:EditableSite[];staff:EditableStaff[];scope:string}> { return cloud().mobileSiteUpdateOptions() }
export async function createSiteUpdateDraft(site_id:string,data:SiteUpdateDraft):Promise<{id:string;status:'draft'}> { return cloud().createMobileSiteUpdate({site_id,data}) }
