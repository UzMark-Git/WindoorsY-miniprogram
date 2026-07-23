<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { searchContent } from '../../api/content'
import type { SearchContentType, SearchGroup, SearchItem, SearchResult } from '../../types/domain'
import { siteDetailUrl } from '../../utils/site-navigation'

const STORE_ID='store_windoors_demo',placeholder='/static/demo/placeholder.png'
const types:SearchContentType[]=['products','staff','sites','warranties']
const labels:Record<SearchContentType,string>={products:'产品',staff:'人员',sites:'案例',warranties:'质保服务'}
const keyword=ref(''),searchedKeyword=ref(''),focus=ref(false),loading=ref(false),error=ref('')
const loadingMore=reactive<Record<SearchContentType,boolean>>({products:false,staff:false,sites:false,warranties:false})
const emptyGroup=():SearchGroup=>({items:[],page:1,pageSize:5,hasMore:false})
const groups=reactive<Record<SearchContentType,SearchGroup>>({products:emptyGroup(),staff:emptyGroup(),sites:emptyGroup(),warranties:emptyGroup()})
const visibleTypes=computed(()=>types.filter(type=>groups[type].items.length))

function inputValue(event:any){return String(event?.detail?.value??event?.value??keyword.value).trim()}
async function submit(event?:any){
  const value=inputValue(event);keyword.value=value
  if(value.length<2){uni.showToast({title:'请至少输入2个字符',icon:'none'});focus.value=true;return}
  if(value.length>30){uni.showToast({title:'搜索关键词最多30个字符',icon:'none'});return}
  loading.value=true;error.value=''
  try{const result=await searchContent({keyword:value,storeId:STORE_ID}) as SearchResult;searchedKeyword.value=result.keyword;for(const type of types)groups[type]=result.groups[type]||emptyGroup()}
  catch(e:any){error.value=/network|offline|网络/i.test(String(e?.message||e))?'网络已断开，请检查后重试':'搜索失败，请稍后重试'}finally{loading.value=false}
}
async function more(type:SearchContentType){
  if(loadingMore[type]||!groups[type].hasMore)return;loadingMore[type]=true
  try{const result=await searchContent({keyword:searchedKeyword.value,storeId:STORE_ID,type,page:groups[type].page+1,pageSize:5}) as {group:SearchGroup};groups[type]={...result.group,items:[...groups[type].items,...result.group.items]}}
  catch{uni.showToast({title:'加载更多失败',icon:'none'})}finally{loadingMore[type]=false}
}
function open(item:SearchItem){const urls={products:`/pages-sub/products/detail?id=${encodeURIComponent(item.id)}`,staff:`/pages-sub/staff/detail?id=${encodeURIComponent(item.id)}`,sites:siteDetailUrl(item.id),warranties:`/pages-sub/services/detail?id=${encodeURIComponent(item.id)}`};uni.navigateTo({url:urls[item.type]})}
onLoad(query=>{keyword.value=String(query?.keyword||'').trim();focus.value=!keyword.value;if(keyword.value)submit()})
</script>

<template>
  <view class="page">
    <view class="search-box"><text>⌕</text><input v-model="keyword" :focus="focus" confirm-type="search" maxlength="30" placeholder="搜索产品、人员、案例、质保" @confirm="submit"/><button @click="submit">搜索</button></view>
    <view v-if="loading" class="state">正在搜索…</view>
    <view v-else-if="error" class="state error"><text>{{error}}</text><button @click="submit">重新搜索</button></view>
    <view v-else-if="searchedKeyword&&!visibleTypes.length" class="state"><text>没有找到“{{searchedKeyword}}”</text><text class="hint">试试产品名称、人员姓名、案例区域或质保编号</text></view>
    <view v-else-if="!searchedKeyword" class="state"><text>搜索当前门店的公开内容</text><text class="hint">可搜索产品、人员、案例和质保服务</text></view>
    <view v-else class="groups">
      <view v-for="type in visibleTypes" :key="type" class="group">
        <view class="heading"><text>{{labels[type]}}</text><text>{{groups[type].items.length}} 条结果</text></view>
        <button v-for="item in groups[type].items" :key="`${type}-${item.id}`" class="result" :aria-label="`查看${labels[type]}${item.title}`" @click="open(item)"><image :src="item.image||placeholder" mode="aspectFill"/><view><text class="title">{{item.title}}</text><text class="summary">{{item.summary}}</text><text class="meta">{{item.meta}}</text></view><text class="arrow">›</text></button>
        <button v-if="groups[type].hasMore" class="more" :disabled="loadingMore[type]" @click="more(type)">{{loadingMore[type]?'加载中…':'加载更多'}}</button>
      </view>
    </view>
  </view>
</template>

<style scoped>
.page{min-height:100vh;padding:24rpx 26rpx 70rpx;background:#f3f6f4}.search-box{display:flex;align-items:center;gap:14rpx;padding:14rpx 16rpx 14rpx 24rpx;border-radius:20rpx;background:#fff;box-shadow:0 8rpx 28rpx rgba(24,62,52,.08)}.search-box>text{color:#a57941;font-size:34rpx}.search-box input{flex:1;height:62rpx;color:#263e37;font-size:25rpx}.search-box button{margin:0;padding:0 24rpx;height:62rpx;line-height:62rpx;border:0;border-radius:14rpx;color:#fff;background:#245c50;font-size:24rpx}.search-box button::after,.result::after,.more::after{border:0}.state{display:flex;flex-direction:column;align-items:center;gap:16rpx;padding:120rpx 30rpx;text-align:center;color:#65766f;font-size:26rpx}.state .hint{color:#95a09c;font-size:22rpx}.state button{color:#245c50;background:#e6f0ec}.groups{display:flex;flex-direction:column;gap:24rpx;margin-top:28rpx}.group{padding:28rpx 24rpx;border-radius:20rpx;background:#fff}.heading{display:flex;justify-content:space-between;align-items:center;margin-bottom:10rpx}.heading text:first-child{color:#183d34;font-size:31rpx;font-weight:650}.heading text:last-child{color:#929e99;font-size:21rpx}.result{display:flex;align-items:center;gap:18rpx;width:100%;margin:0;padding:20rpx 0;border:0;border-bottom:1rpx solid #edf1ef;text-align:left;line-height:normal;background:transparent}.result image{flex:none;width:120rpx;height:96rpx;border-radius:12rpx;background:#e7ecea}.result view{flex:1;min-width:0}.title,.summary,.meta{display:block}.title{color:#203b34;font-size:27rpx;font-weight:650}.summary{margin-top:8rpx;overflow:hidden;color:#687872;font-size:22rpx;white-space:nowrap;text-overflow:ellipsis}.meta{margin-top:8rpx;overflow:hidden;color:#a37842;font-size:20rpx;white-space:nowrap;text-overflow:ellipsis}.arrow{color:#9aa6a1;font-size:38rpx}.more{margin:20rpx auto 0;border:1rpx solid #c7d5d0;border-radius:30rpx;color:#245c50;background:#f7faf8;font-size:23rpx}
</style>
