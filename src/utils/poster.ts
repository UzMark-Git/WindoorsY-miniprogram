export async function usableImageUrl(value:string){
  if(!value)return ''
  if(!value.startsWith('cloud://'))return value
  const result=await (uniCloud as any).getTempFileURL({fileList:[value]})
  return result.fileList?.[0]?.tempFileURL||''
}
export async function localImage(value:string){
  const src=await usableImageUrl(value)
  if(!src)throw new Error('海报图片不可用')
  const info=await uni.getImageInfo({src})
  return info.path
}
export function posterLines(text:string,max=18,rows=2){
  const value=String(text||'').trim(),result:string[]=[]
  for(let i=0;i<value.length&&result.length<rows;i+=max)result.push(value.slice(i,i+max))
  return result
}
export function shouldOfferSettings(error:unknown){return /auth deny|authorize:fail|permission/i.test(String((error as any)?.errMsg||(error as any)?.message||error))}
