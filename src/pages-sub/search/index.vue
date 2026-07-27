<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { onLoad, onReady } from '@dcloudio/uni-app'
import { getSearchDiscovery, searchContent } from '../../api/content'
import type { SearchContentType, SearchDiscovery, SearchGroup, SearchItem, SearchResult } from '../../types/domain'
import { constructionDetailUrl, siteDetailUrl } from '../../utils/site-navigation'

const STORE_ID='store_windoors_demo',placeholder='/static/demo/placeholder.png'
const SEARCH_DISCOVERY_KEY='search-discovery-v4',SEARCH_DISCOVERY_TTL=30*60*1000
const types:SearchContentType[]=['products','sites','construction','warranties']
const labels:Record<SearchContentType,string>={products:'产品',sites:'案例',construction:'施工',warranties:'质保'}
const discoveryTypes:Array<{type:SearchContentType;label:string}>=[{type:'products',label:'产品'},{type:'sites',label:'案例'},{type:'construction',label:'施工'},{type:'warranties',label:'质保'}]
const keyword=ref(''),searchedKeyword=ref(''),focus=ref(false),loading=ref(false),error=ref('')
const discovery=reactive<SearchDiscovery>({keywords:[],groups:{products:[],sites:[],construction:[],warranties:[]}}),activeDiscoveryIndex=ref(0)
const loadingMore=reactive<Record<SearchContentType,boolean>>({products:false,sites:false,construction:false,warranties:false})
const emptyGroup=():SearchGroup=>({items:[],page:1,pageSize:5,hasMore:false})
const groups=reactive<Record<SearchContentType,SearchGroup>>({products:emptyGroup(),sites:emptyGroup(),construction:emptyGroup(),warranties:emptyGroup()})
const visibleTypes=computed(()=>types.filter(type=>groups[type].items.length))
const activeDiscoveryType=computed(()=>discoveryTypes[activeDiscoveryIndex.value].type)
const discoverySwiperHeight=computed(()=>`${Math.max(1,Math.ceil((discovery.groups[activeDiscoveryType.value]||[]).length/2))*320+36}rpx`)

function normalizeDiscovery(data:SearchDiscovery):SearchDiscovery{return {keywords:(data.keywords||[]).slice(0,6),groups:{products:(data.groups?.products||[]).slice(0,4),sites:(data.groups?.sites||[]).slice(0,4),construction:(data.groups?.construction||[]).slice(0,4),warranties:(data.groups?.warranties||[]).slice(0,4)}}}
async function loadDiscovery(){const cached=uni.getStorageSync(SEARCH_DISCOVERY_KEY) as {savedAt?:number;data?:SearchDiscovery}|undefined;if(cached?.data&&Date.now()-Number(cached.savedAt||0)<SEARCH_DISCOVERY_TTL){Object.assign(discovery,normalizeDiscovery(cached.data));return}try{const data=normalizeDiscovery(await getSearchDiscovery(STORE_ID));Object.assign(discovery,data);uni.setStorageSync(SEARCH_DISCOVERY_KEY,{savedAt:Date.now(),data})}catch{}}
function searchKeyword(value:string){keyword.value=value;submit()}
function selectDiscoveryType(type:SearchContentType){activeDiscoveryIndex.value=Math.max(0,discoveryTypes.findIndex(item=>item.type===type))}
function changeDiscoverySwiper(event:{detail:{current:number}}){activeDiscoveryIndex.value=Number(event.detail.current)||0}
function openDiscoveryItem(item:SearchItem){open(item)}

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
function open(item:SearchItem){const urls={products:`/pages-sub/products/detail?id=${encodeURIComponent(item.id)}`,sites:siteDetailUrl(item.id),construction:constructionDetailUrl(item.id),warranties:`/pages-sub/services/detail?id=${encodeURIComponent(item.id)}`};uni.navigateTo({url:urls[item.type]})}
onLoad(query=>{keyword.value=String(query?.keyword||'').trim();loadDiscovery();if(keyword.value)submit()})
onReady(()=>{setTimeout(()=>focus.value=true,220)})
</script>

<template>
  <view class="page">
    <view class="search-box"><text>⌕</text><input v-model="keyword" :focus="focus" confirm-type="search" maxlength="30" placeholder="搜索一下，找到你家封窗方案与报价~" @confirm="submit"/><button @click="submit">搜索</button></view>
    <view v-if="loading" class="state">正在搜索…</view>
    <view v-else-if="error" class="state error"><text>{{error}}</text><button @click="submit">重新搜索</button></view>
    <view v-else-if="searchedKeyword&&!visibleTypes.length" class="state"><text>没有找到“{{searchedKeyword}}”</text><text class="hint">试试案例名称、施工阶段或质保编号</text></view>
    <view v-else-if="!searchedKeyword" class="discovery"><view v-if="discovery.keywords.length" class="keyword-block"><text class="discovery-title">猜你想找</text><view class="keyword-list"><button v-for="item in discovery.keywords" :key="item" @click="searchKeyword(item)">{{item}}</button></view></view><view class="discovery-tabs"><button v-for="item in discoveryTypes" :key="item.type" :class="{active:activeDiscoveryType===item.type}" @click="selectDiscoveryType(item.type)">{{item.label}}</button></view><swiper class="discovery-swiper" :current="activeDiscoveryIndex" :style="{height:discoverySwiperHeight}" @change="changeDiscoverySwiper"><swiper-item v-for="group in discoveryTypes" :key="group.type"><view v-if="discovery.groups[group.type].length" class="discovery-grid"><button v-for="item in discovery.groups[group.type]" :key="`${item.type}-${item.id}`" class="discovery-card" @click="openDiscoveryItem(item)"><image :src="item.image||placeholder" mode="aspectFill"/><text class="title">{{item.title}}</text><text class="meta">{{item.meta}}</text></button></view><view v-else class="state compact"><text>暂无推荐内容</text><text class="hint">输入名称、地区或阶段试试</text></view></swiper-item></swiper><view class="discovery-note"><text>搜索当前门店的公开内容</text><text>可搜索产品、案例、施工和质保内容</text></view></view>
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
<style scoped>.discovery-note{display:flex;flex-direction:column;align-items:center;gap:10rpx;padding:58rpx 20rpx 30rpx;color:#65766f;font-size:24rpx}.discovery-note text+text{color:#95a09c;font-size:22rpx}</style>
<style scoped>.discovery{padding:40rpx 4rpx}.discovery-title{display:block;color:#536861;font-size:24rpx;font-weight:650}.keyword-list{display:flex;flex-wrap:wrap;gap:14rpx;margin-top:18rpx}.keyword-list button{margin:0;padding:0 20rpx;height:58rpx;line-height:58rpx;border:1rpx solid #dce7e2;border-radius:29rpx;color:#315d51;background:#fff;font-size:21rpx}.keyword-list button::after,.discovery-tabs button::after,.discovery-card::after{border:0}.discovery-tabs{display:grid;grid-template-columns:repeat(4,1fr);gap:14rpx;margin-top:38rpx}.discovery-tabs button{margin:0;height:66rpx;line-height:66rpx;border-radius:12rpx;color:#62746d;background:#e8eeeb;font-size:23rpx}.discovery-tabs button.active{color:#fff;background:#245c50}.discovery-swiper{width:100%;transition:height .18s ease}.discovery-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:18rpx;margin-top:22rpx}.discovery-card{min-width:0;margin:0;padding:0 0 18rpx;overflow:hidden;border:0;border-radius:14rpx;text-align:left;line-height:normal;background:#fff}.discovery-card image{display:block;width:100%;height:180rpx}.discovery-card .title,.discovery-card .meta{display:block;margin-left:16rpx;margin-right:16rpx;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}.discovery-card .title{margin-top:14rpx;color:#203b34;font-size:24rpx;font-weight:650}.discovery-card .meta{margin-top:8rpx;color:#8a6a42;font-size:19rpx}.state.compact{padding:70rpx 20rpx}</style>
