export type FavoriteType = 'product' | 'site' | 'staff' | 'warranty'
export type FavoriteCard = { _id:string; type:FavoriteType; title:string; image:string; summary:string; favorite_at:number }
type FavoriteCloud = {
  getState(input:{type:FavoriteType;id:string}):Promise<{authenticated:boolean;favorited:boolean}>
  toggle(input:{type:FavoriteType;id:string}):Promise<{favorited:boolean}>
  list(input:{type:FavoriteType;page:number;pageSize:number}):Promise<{items:FavoriteCard[];page:number;pageSize:number;hasMore:boolean}>
}
const cloud=()=>uniCloud.importObject('favorite-co') as FavoriteCloud
export const getFavoriteState=(type:FavoriteType,id:string)=>cloud().getState({type,id})
export const toggleFavorite=(type:FavoriteType,id:string)=>cloud().toggle({type,id})
export const listFavorites=(type:FavoriteType,page=1,pageSize=20)=>cloud().list({type,page,pageSize})
