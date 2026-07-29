import type { FavoriteType } from './favorites'
import { assertCloudRuntime } from '../config/demo-isolation'
export type PosterPayload={type:FavoriteType;id:string;title:string;summary:string;image:string;store_name:string;store_logo:string;code_file:string;token:string}
export type MiniProgramEnv='develop'|'trial'|'release'
type ShareCloud={preparePoster(input:{type:FavoriteType;id:string;envVersion:MiniProgramEnv}):Promise<PosterPayload>;resolve(input:{token:string}):Promise<{type:FavoriteType;id:string;path:string}>}
const cloud=()=>{
  assertCloudRuntime('云端分享')
  return uniCloud.importObject('share-co') as ShareCloud
}
export const preparePoster=(type:FavoriteType,id:string,envVersion:MiniProgramEnv)=>cloud().preparePoster({type,id,envVersion})
export const resolveShareToken=(token:string)=>cloud().resolve({token})
