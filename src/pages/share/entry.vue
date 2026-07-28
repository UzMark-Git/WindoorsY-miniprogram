<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app'
import { ref } from 'vue'
import { resolveShareToken } from '../../api/sharing'
import ContentState from '../../components/content-state.vue'
import { getDemoPageBlock } from '../../config/demo-isolation'
const status=ref<'loading'|'error'|'empty'>('loading'),message=ref('正在打开分享内容…'),currentToken=ref('')
async function open(token:string){
  currentToken.value=token
  const demoBlock=getDemoPageBlock('云端分享内容')
  if(demoBlock){status.value='empty';message.value=demoBlock;return}
  if(!token){status.value='empty';message.value='分享链接无效';return}
  status.value='loading';message.value='正在打开分享内容…'
  try{const result=await resolveShareToken(token);uni.redirectTo({url:result.path})}
  catch(error:any){
    const missing=error?.errCode==='CONTENT_NOT_FOUND'
    status.value=missing?'empty':'error';message.value=missing?'内容已下架或不存在':(error?.errMsg||'分享内容加载失败')
  }
}
function decode(value:string){try{return decodeURIComponent(value)}catch{return value}}
onLoad((query:Record<string,string|undefined>)=>open(decode(query.scene||query.token||'')))
</script>
<template><view class="page"><ContentState :status="status" :message="message" @retry="open(currentToken)"/></view></template>
<style scoped>.page{min-height:100vh;padding-top:120rpx;background:#f4f6f4}</style>
