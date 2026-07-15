import type { FavoriteType } from '../api/favorites'

const PATHS:Record<FavoriteType,string>={product:'/pages-sub/products/detail',site:'/pages-sub/sites/detail',staff:'/pages-sub/staff/detail',warranty:'/pages-sub/services/detail'}
export function detailPath(type:FavoriteType,id:string){return `${PATHS[type]}?id=${encodeURIComponent(id)}`}
export function shareMessage(type:FavoriteType,id:string,title:string,imageUrl=''){
  return {title,path:detailPath(type,id),...(imageUrl?{imageUrl}:{})}
}
export function timelineMessage(title:string,imageUrl=''){return {title,...(imageUrl?{imageUrl}:{})}}
export function isAuthFailure(error:unknown){const code=(error as any)?.errCode;return code==='AUTH_REQUIRED'||code==='uni-id-check-token-failed'||code==='uni-id-token-expired'}
export function loginUrl(returnUrl:string){return `/uni_modules/uni-id-pages/pages/login/login?uniIdRedirectUrl=${encodeURIComponent(returnUrl)}`}
export function currentMiniProgramEnv(){
  try{const value=(uni.getAccountInfoSync() as any)?.miniProgram?.envVersion;return ['develop','trial','release'].includes(value)?value:'release'}catch(e){return 'release'}
}
