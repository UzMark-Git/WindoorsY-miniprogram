<script setup lang="ts">
import { getCurrentInstance, onMounted, ref } from 'vue'
import type { FavoriteType } from '../api/favorites'
import { getFavoriteState, toggleFavorite } from '../api/favorites'
import { preparePoster } from '../api/sharing'
import { currentMiniProgramEnv, isAuthFailure, loginUrl } from '../utils/content-sharing'
import { localImage, posterLines, shouldOfferSettings } from '../utils/poster'

const props=defineProps<{type:FavoriteType;contentId:string;title:string;image:string;returnUrl:string}>()
const emit=defineEmits<{appoint:[]}>()
const favorited=ref(false),favoriteBusy=ref(false),guide=ref(false),posterOpen=ref(false),posterBusy=ref(false),posterError=ref(''),posterPath=ref('')
const canvasId='share-poster-canvas',instance=getCurrentInstance()?.proxy

async function refreshFavorite(){try{const state=await getFavoriteState(props.type,props.contentId);favorited.value=state.favorited}catch(e){}}
async function favorite(){
  if(favoriteBusy.value)return
  favoriteBusy.value=true
  try{favorited.value=(await toggleFavorite(props.type,props.contentId)).favorited;uni.showToast({title:favorited.value?'已收藏':'已取消',icon:'none'})}
  catch(error){if(isAuthFailure(error))uni.navigateTo({url:loginUrl(props.returnUrl)});else uni.showToast({title:(error as any)?.errMsg||'收藏失败',icon:'none'})}
  finally{favoriteBusy.value=false}
}
function timeline(){guide.value=true}
function closeGuide(){guide.value=false}
async function drawPoster(){
  posterOpen.value=true;posterBusy.value=true;posterError.value='';posterPath.value=''
  try{
    const data=await preparePoster(props.type,props.contentId,currentMiniProgramEnv())
    const [main,code,logo]=await Promise.all([localImage(data.image),localImage(data.code_file),data.store_logo?localImage(data.store_logo).catch(()=> ''):Promise.resolve('')])
    const ctx=uni.createCanvasContext(canvasId,instance as any)
    ctx.setFillStyle('#f2f5f3');ctx.fillRect(0,0,750,1200)
    ctx.drawImage(main,0,0,750,620)
    ctx.setFillStyle('#ffffff');ctx.fillRect(28,580,694,590)
    if(logo)ctx.drawImage(logo,62,625,72,72)
    ctx.setFillStyle('#173b32');ctx.setFontSize(26);ctx.fillText(data.store_name||'WindoorsY 门窗服务',logo?152:62,670)
    ctx.setFontSize(42);ctx.setFillStyle('#172d28');posterLines(data.title,14,2).forEach((line,index)=>ctx.fillText(line,62,770+index*56))
    ctx.setFontSize(24);ctx.setFillStyle('#687873');posterLines(data.summary,22,2).forEach((line,index)=>ctx.fillText(line,62,900+index*38))
    ctx.drawImage(code,468,820,220,220)
    ctx.setFontSize(22);ctx.setFillStyle('#7c8984');ctx.fillText('长按识别小程序码查看详情',62,1060)
    ctx.setFontSize(20);ctx.setFillStyle('#a57941');ctx.fillText('专业门窗 · 安心交付',62,1105)
    await new Promise<void>((resolve)=>ctx.draw(false,()=>resolve()))
    const file=await uni.canvasToTempFilePath({canvasId,x:0,y:0,width:750,height:1200,destWidth:750,destHeight:1200,fileType:'png',quality:1},instance as any)
    posterPath.value=file.tempFilePath
  }catch(error:any){posterError.value=error?.errMsg||error?.message||'海报生成失败，请重试'}finally{posterBusy.value=false}
}
async function savePoster(){
  if(!posterPath.value)return
  try{await uni.saveImageToPhotosAlbum({filePath:posterPath.value});uni.showToast({title:'已保存到相册'})}
  catch(error){if(shouldOfferSettings(error)){const result=await uni.showModal({title:'需要相册权限',content:'请在设置中允许保存图片，用于保存分享海报。',confirmText:'去设置'});if(result.confirm)uni.openSetting({})}else uni.showToast({title:'保存失败，请重试',icon:'none'})}
}
onMounted(()=>{refreshFavorite();uni.showShareMenu({menus:['shareAppMessage','shareTimeline'] as any})})
</script>

<template><view class="bar"><view class="tools"><button open-type="share"><text class="icon">↗</text><text>转发</text></button><button :disabled="favoriteBusy" @click="favorite"><text class="icon">{{favorited?'★':'☆'}}</text><text>{{favorited?'已收藏':'收藏'}}</text></button><button @click="timeline"><text class="icon">◎</text><text>朋友圈</text></button><button @click="drawPoster"><text class="icon">▧</text><text>海报</text></button></view><button class="appoint" @click="emit('appoint')">立即预约</button></view>
<view v-if="guide" class="mask" @click="closeGuide"><view class="timeline-guide"><text class="arrow">↗</text><text>点击右上角“…”</text><text>选择“分享到朋友圈”</text><button @click.stop="closeGuide">知道了</button></view></view>
<view v-if="posterOpen" class="mask poster-mask"><view class="poster-panel"><text class="poster-title">分享海报</text><view v-if="posterBusy" class="poster-state">正在生成品牌海报…</view><view v-else-if="posterError" class="poster-state error">{{posterError}}<button @click="drawPoster">重新生成</button></view><image v-else-if="posterPath" class="poster-preview" :src="posterPath" mode="widthFix" show-menu-by-longpress/><view class="poster-actions"><button @click="posterOpen=false">取消</button><button class="save" :disabled="!posterPath" @click="savePoster">保存相册</button></view></view></view>
<canvas :canvas-id="canvasId" :id="canvasId" class="poster-canvas"/>
</template>

<style scoped>.bar{position:fixed;left:0;right:0;bottom:0;z-index:20;display:flex;align-items:center;gap:12rpx;padding:14rpx 20rpx calc(14rpx + env(safe-area-inset-bottom));background:#fff;box-shadow:0 -6rpx 24rpx rgba(25,55,47,.08)}.tools{display:grid;grid-template-columns:repeat(4,1fr);flex:1;min-width:0}.tools button{min-width:0;margin:0;padding:4rpx 0;border:0;line-height:1.2;background:transparent;color:#68756f;font-size:19rpx}.tools button::after,.appoint::after{border:0}.tools button text{display:block}.icon{height:36rpx;color:#31574d;font-size:32rpx}.appoint{flex:0 0 218rpx;height:78rpx;margin:0;border:0;border-radius:42rpx;line-height:78rpx;color:#fff;background:#24564a;font-size:27rpx;font-weight:650}.mask{position:fixed;inset:0;z-index:80;background:rgba(9,28,23,.58);display:flex;align-items:flex-start;justify-content:flex-end;padding:25rpx}.timeline-guide{width:330rpx;margin-top:70rpx;padding:30rpx;border-radius:18rpx;background:#fff;color:#27443c}.timeline-guide>text{display:block;margin-top:8rpx;font-size:25rpx}.timeline-guide .arrow{text-align:right;color:#a57941;font-size:52rpx}.timeline-guide button{margin-top:22rpx;border:0;border-radius:30rpx;color:#fff;background:#24564a;font-size:23rpx}.timeline-guide button::after{border:0}.poster-mask{align-items:center;justify-content:center;padding:30rpx}.poster-panel{box-sizing:border-box;width:100%;max-height:92vh;padding:26rpx;border-radius:22rpx;background:#fff}.poster-title{display:block;margin-bottom:20rpx;color:#183b32;font-size:30rpx;font-weight:650}.poster-preview{display:block;width:420rpx;max-height:68vh;margin:auto}.poster-state{padding:100rpx 20rpx;text-align:center;color:#74827e;font-size:25rpx}.poster-state.error{color:#b5483f}.poster-state button{margin-top:20rpx}.poster-actions{display:flex;gap:16rpx;margin-top:20rpx}.poster-actions button{flex:1;margin:0;border:0;border-radius:34rpx;background:#edf2ef;color:#31574d;font-size:25rpx}.poster-actions .save{color:#fff;background:#24564a}.poster-canvas{position:fixed;left:-2000px;top:0;width:750px;height:1200px;pointer-events:none}@media(max-width:350px){.appoint{flex-basis:190rpx}.tools button{font-size:17rpx}}</style>
