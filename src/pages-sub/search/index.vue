<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { onLoad, onReady } from '@dcloudio/uni-app'
import { getSearchDiscovery, searchContent } from '../../api/content'
import type { SearchContentType, SearchDiscovery, SearchGroup, SearchItem, SearchResult } from '../../types/domain'
import { constructionDetailUrl, siteDetailUrl } from '../../utils/site-navigation'
import { buildEmptySearchActions, productCategoryLabel } from './search-presentation'
import { searchDiscoveryCacheKey } from '../../utils/search-discovery-cache'

const STORE_ID='store_windoors_demo',placeholder='/static/demo/placeholder.png'
const SEARCH_DISCOVERY_KEY=searchDiscoveryCacheKey(STORE_ID),SEARCH_DISCOVERY_TTL=30*60*1000
const types:SearchContentType[]=['products','sites','construction','warranties']
const labels:Record<SearchContentType,string>={products:'产品',sites:'案例',construction:'施工',warranties:'质保'}
const discoveryTypes:Array<{type:SearchContentType;label:string}>=[{type:'products',label:'产品'},{type:'sites',label:'案例'},{type:'construction',label:'施工'},{type:'warranties',label:'质保'}]
const keyword=ref(''),searchedKeyword=ref(''),focus=ref(false),loading=ref(false),error=ref('')
const discovery=reactive<SearchDiscovery>({keywords:[],groups:{products:[],sites:[],construction:[],warranties:[]},contact_phone:''}),activeDiscoveryIndex=ref(0)
const loadingMore=reactive<Record<SearchContentType,boolean>>({products:false,sites:false,construction:false,warranties:false})
const failedImages=ref<Record<string,boolean>>({})
const emptyGroup=():SearchGroup=>({items:[],page:1,pageSize:5,hasMore:false})
const groups=reactive<Record<SearchContentType,SearchGroup>>({products:emptyGroup(),sites:emptyGroup(),construction:emptyGroup(),warranties:emptyGroup()})
const visibleTypes=computed(()=>types.filter(type=>groups[type].items.length))
const activeDiscoveryType=computed(()=>discoveryTypes[activeDiscoveryIndex.value].type)
const discoverySwiperHeight='270rpx'
const emptyActions=computed(()=>buildEmptySearchActions(discovery.contact_phone))

function normalizeDiscovery(data:SearchDiscovery):SearchDiscovery{return {keywords:(data.keywords||[]).slice(0,4),groups:{products:(data.groups?.products||[]).slice(0,5),sites:(data.groups?.sites||[]).slice(0,5),construction:(data.groups?.construction||[]).slice(0,5),warranties:(data.groups?.warranties||[]).slice(0,5)},contact_phone:String(data.contact_phone||'').trim()}}
async function loadDiscovery(){const cached=uni.getStorageSync(SEARCH_DISCOVERY_KEY) as {savedAt?:number;data?:SearchDiscovery}|undefined;if(cached?.data&&Date.now()-Number(cached.savedAt||0)<SEARCH_DISCOVERY_TTL){Object.assign(discovery,normalizeDiscovery(cached.data));return}try{const data=normalizeDiscovery(await getSearchDiscovery(STORE_ID));Object.assign(discovery,data);uni.setStorageSync(SEARCH_DISCOVERY_KEY,{savedAt:Date.now(),data})}catch{}}
function searchKeyword(value:string){keyword.value=value;submit()}
function selectDiscoveryType(type:SearchContentType){activeDiscoveryIndex.value=Math.max(0,discoveryTypes.findIndex(item=>item.type===type))}
function changeDiscoverySwiper(event:{detail:{current:number}}){activeDiscoveryIndex.value=Number(event.detail.current)||0}
function inputValue(event:any){return String(event?.detail?.value??event?.value??keyword.value).trim()}
function itemImage(item:SearchItem){return failedImages.value[`${item.type}-${item.id}`]?placeholder:(item.image||placeholder)}
function itemMeta(item:SearchItem){return item.type==='products'?productCategoryLabel(item.meta):item.meta}
function failImage(item:SearchItem){failedImages.value[`${item.type}-${item.id}`]=true}
function open(item:SearchItem){const urls={products:`/pages-sub/products/detail?id=${encodeURIComponent(item.id)}`,sites:siteDetailUrl(item.id),construction:constructionDetailUrl(item.id),warranties:`/pages-sub/services/detail?id=${encodeURIComponent(item.id)}`};uni.navigateTo({url:urls[item.type]})}
function openDiscoveryItem(item:SearchItem){open(item)}
function openEmptyContact(){const contact=emptyActions.value.contact;if(contact.type==='phone'){uni.makePhoneCall({phoneNumber:contact.phone});return}uni.switchTab({url:'/pages/services/index'})}
async function submit(event?:any){const value=inputValue(event);keyword.value=value;if(value.length<2){uni.showToast({title:'请至少输入 2 个字符',icon:'none'});focus.value=true;return}if(value.length>30){uni.showToast({title:'搜索关键词最多 30 个字符',icon:'none'});return}loading.value=true;error.value='';try{const result=await searchContent({keyword:value,storeId:STORE_ID}) as SearchResult;searchedKeyword.value=result.keyword;for(const type of types)groups[type]=result.groups[type]||emptyGroup()}catch(e:any){error.value=/network|offline|网络/i.test(String(e?.message||e))?'网络已断开，请检查后重试':'搜索失败，请稍后重试'}finally{loading.value=false}}
async function more(type:SearchContentType){if(loadingMore[type]||!groups[type].hasMore)return;loadingMore[type]=true;try{const result=await searchContent({keyword:searchedKeyword.value,storeId:STORE_ID,type,page:groups[type].page+1,pageSize:5}) as {group:SearchGroup};groups[type]={...result.group,items:[...groups[type].items,...result.group.items]}}catch{uni.showToast({title:'加载更多失败',icon:'none'})}finally{loadingMore[type]=false}}
onLoad(query=>{keyword.value=String(query?.keyword||'').trim();loadDiscovery();if(keyword.value)submit()})
onReady(()=>{setTimeout(()=>focus.value=true,220)})
</script>

<template>
  <view class="page">
    <view class="search-box"><text>⌕</text><input v-model="keyword" :focus="focus" confirm-type="search" maxlength="30" placeholder="搜索一下，找到你家封窗方案与报价" @confirm="submit"/><button @click="submit">搜索</button></view>
    <view v-if="loading" class="state">正在搜索…</view>
    <view v-else-if="error" class="state error"><text>{{error}}</text><button @click="submit">重新搜索</button></view>
    <view v-else-if="searchedKeyword&&!visibleTypes.length" class="state empty-result"><text>没有找到“{{searchedKeyword}}”</text><text class="hint">试试案例名称、施工阶段或质保编号</text><view class="empty-keywords"><button v-for="item in emptyActions.keywords" :key="item" @click="searchKeyword(item)">{{item}}</button></view><button class="contact-button" @click="openEmptyContact">{{emptyActions.contact.type==='phone'?'电话咨询门店':'查看服务咨询入口'}}</button></view>
    <view v-else-if="!searchedKeyword" class="discovery">
      <view v-if="discovery.keywords.length" class="keyword-block"><text class="discovery-title">猜你喜欢找</text><view class="keyword-list"><button v-for="item in discovery.keywords" :key="item" @click="searchKeyword(item)">{{item}}</button></view></view>
      <view class="discovery-panel">
        <view class="discovery-tabs"><button v-for="item in discoveryTypes" :key="item.type" :class="{active:activeDiscoveryType===item.type}" @click="selectDiscoveryType(item.type)">{{item.label}}</button></view>
        <swiper class="discovery-swiper" :current="activeDiscoveryIndex" :style="{height:discoverySwiperHeight}" @change="changeDiscoverySwiper"><swiper-item v-for="group in discoveryTypes" :key="group.type"><scroll-view scroll-x :show-scrollbar="false" class="discovery-scroll"><view v-if="discovery.groups[group.type].length" class="discovery-row"><button v-for="item in discovery.groups[group.type].slice(0,5)" :key="`${item.type}-${item.id}`" class="discovery-card" @click="openDiscoveryItem(item)"><image :src="itemImage(item)" mode="aspectFill" @error="failImage(item)"/><view class="discovery-copy"><text class="title">{{item.title}}</text><text class="meta">{{itemMeta(item)}}</text></view></button></view><view v-else class="state compact"><text>暂无推荐内容</text><text class="hint">输入名称、地区或阶段试试</text></view></scroll-view></swiper-item></swiper>
      </view>
      <view class="discovery-note"><text>搜索当前门店的公开内容</text><text>可搜索产品、案例、施工和质保内容</text></view>
    </view>
    <view v-else class="groups"><view v-for="type in visibleTypes" :key="type" class="group"><view class="heading"><text>{{labels[type]}}</text><text>{{groups[type].items.length}} 条结果</text></view><button v-for="item in groups[type].items" :key="`${type}-${item.id}`" class="result" :aria-label="`查看${labels[type]}${item.title}`" @click="open(item)"><image :src="itemImage(item)" mode="aspectFill" @error="failImage(item)"/><view><text class="title">{{item.title}}</text><text class="summary">{{item.summary}}</text><text class="meta">{{itemMeta(item)}}</text></view><text class="arrow">›</text></button><button v-if="groups[type].hasMore" class="more" :disabled="loadingMore[type]" @click="more(type)">{{loadingMore[type]?'加载中…':'加载更多'}}</button></view></view>
  </view>
</template>

<style scoped>
.page{min-height:100vh;padding:24rpx 26rpx 70rpx;background:#f3f6f4}.search-box{display:flex;align-items:center;gap:14rpx;padding:14rpx 16rpx 14rpx 24rpx;border-radius:28rpx;background:#fff;box-shadow:0 8rpx 28rpx rgba(24,62,52,.08)}.search-box>text{color:#a57941;font-size:34rpx}.search-box input{flex:1;height:62rpx;color:#263e37;font-size:25rpx}.keyword-list button,.discovery-tabs button,.empty-keywords button,.contact-button{min-width:88rpx;min-height:88rpx;margin:0;border:0;line-height:normal}.search-box button{min-width:124rpx;min-height:88rpx;margin:0;padding:0 24rpx;border:0;border-radius:44rpx;color:#fff;background:#245c50;box-shadow:0 8rpx 18rpx rgba(36,92,80,.16);font-size:26rpx;line-height:normal;display:flex;align-items:center;justify-content:center}.search-box button::after,.result::after,.more::after,.keyword-list button::after,.discovery-tabs button::after,.discovery-card::after,.empty-keywords button::after,.contact-button::after{border:0}.search-box button:active,.keyword-list button:active,.discovery-tabs button:active{transform:scale(.97);opacity:.88}.state{display:flex;flex-direction:column;align-items:center;gap:16rpx;padding:120rpx 30rpx;text-align:center;color:#65766f;font-size:26rpx}.state .hint{color:#95a09c;font-size:22rpx}.state button{color:#245c50;background:#e6f0ec}.empty-keywords{display:flex;flex-wrap:wrap;justify-content:center;gap:14rpx}.empty-keywords button,.contact-button{display:flex;align-items:center;justify-content:center;padding:0 22rpx;border-radius:44rpx;font-size:26rpx;line-height:normal}.contact-button{color:#fff!important;background:#245c50!important}.groups{display:flex;flex-direction:column;gap:24rpx;margin-top:28rpx}.group{padding:28rpx 24rpx;border-radius:20rpx;background:#fff}.heading{display:flex;justify-content:space-between;align-items:center;margin-bottom:10rpx}.heading text:first-child{color:#183d34;font-size:31rpx;font-weight:650}.heading text:last-child{color:#929e99;font-size:21rpx}.result{display:flex;align-items:center;gap:18rpx;width:100%;min-height:88rpx;margin:0;padding:20rpx 0;border:0;border-bottom:1rpx solid #edf1ef;text-align:left;line-height:normal;background:transparent}.result image{flex:none;width:120rpx;height:96rpx;border-radius:12rpx;background:#e7ecea}.result view{flex:1;min-width:0}.title,.summary,.meta{display:block}.title{color:#203b34;font-size:27rpx;font-weight:650}.summary{margin-top:8rpx;overflow:hidden;color:#687872;font-size:22rpx;white-space:nowrap;text-overflow:ellipsis}.meta{margin-top:8rpx;overflow:hidden;color:#a37842;font-size:20rpx;white-space:nowrap;text-overflow:ellipsis}.arrow{color:#9aa6a1;font-size:38rpx}.more{min-height:88rpx;margin:20rpx auto 0;border:1rpx solid #c7d5d0;border-radius:44rpx;color:#245c50;background:#f7faf8;font-size:23rpx}
.discovery{padding:40rpx 4rpx}.discovery-title{display:block;color:#536861;font-size:24rpx;font-weight:650}.keyword-list{display:grid;grid-template-columns:repeat(4,1fr);gap:14rpx;margin-top:18rpx}.keyword-list button{display:flex;align-items:center;justify-content:center;min-width:0;padding:0 12rpx;overflow:hidden;border:0;border-radius:44rpx;color:#315d51;background:#f5f8f6;font-size:23rpx;white-space:nowrap;text-overflow:ellipsis}.discovery-panel{margin-top:28rpx;padding:20rpx;border-radius:28rpx;background:#fff}.discovery-tabs{display:grid;grid-template-columns:repeat(4,1fr);gap:14rpx}.discovery-tabs button{display:flex;align-items:center;justify-content:center;padding:0;border-radius:18rpx;color:#62746d;background:#f5f8f6;font-size:25rpx}.discovery-tabs button.active{color:#fff;background:#245c50;box-shadow:0 8rpx 18rpx rgba(36,92,80,.14)}.discovery-swiper{width:100%;transition:height .18s ease}.discovery-scroll{width:100%;margin-top:22rpx;white-space:nowrap}.discovery-row{display:flex;gap:12rpx;width:max-content}.discovery-card{flex:0 0 calc((100vw - 124rpx)/3);min-width:0;min-height:226rpx;margin:0;padding:0 0 14rpx;overflow:hidden;border:0;border-radius:18rpx;text-align:left;line-height:normal;background:#f5f8f6}.discovery-card image{display:block;width:100%;height:132rpx}.discovery-copy{min-width:0;padding:12rpx 14rpx 0}.discovery-card .title,.discovery-card .meta{display:block;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}.discovery-card .title{color:#203b34;font-size:22rpx;font-weight:650}.discovery-card .meta{margin-top:8rpx;color:#8a6a42;font-size:18rpx}.state.compact{padding:40rpx 20rpx}.discovery-note{display:flex;flex-direction:column;align-items:center;gap:10rpx;padding:58rpx 20rpx 30rpx;color:#65766f;font-size:24rpx}.discovery-note text+text{color:#95a09c;font-size:22rpx}
</style>
<style scoped>
.search-box input{flex:1;min-height:88rpx;height:88rpx}
</style>
