<template>
  <view class="cu-modal drawer-modal" :class="{'show': isShow}">
    <view class="cu-dialog fullHeight">
      <view class="cu-bar bg-white search">
        <view class="round search-form text-left">
          <text class="lg cuIcon-search text-blue" />
          <input 
		  type="text" 
		  adjust-position="true" 
		  confirm-type="search" 
		  maxlength="30" 
		  placeholder="搜索想去的地点" 
		  :value="searchValue"
		  @input="handleSearch" />
		  <text class="cuIcon-roundclose text-red padding-sm" 
		  v-if="searchValue" @click="() => {searchValue = '', searchedPoints = mapPoints}" />
        </view>
        <view class="btn cu-avatar margin-right-sm round" @click="$emit('hidePopup', 1)" style="background-image:url(https://mp-a6ec9d4b-3d39-473b-b039-90be1a4856a8.cdn.bspapp.com/cloudstorage/fe8170f6-3e23-4f1e-8bc4-d92f7d877cbf.png);" />
      </view>
      <view class="cu-list menu text-left">
        <scroll-view class="light fullWidth text-lg" style="height: 92vh" scroll-y>
          <view class="border-bottom cu-item padding-top-sm" v-for="point in searchedPoints" :data-id="point.id" :key="point.id">
            <view class="flex flex-direction" @click="$emit('moveSelectListLocation', point.id)">
              <view class="margin-left-sm text-black">{{ point.title }}</view>
              <view class="flex align-center padding-tb-sm">
                <view class="cu-tag line-orange margin-left-sm round sm text-sm" v-for="(tag, index) in point.tags" :key="index">
                  {{tag}}
                </view>
              </view>
            </view>
          </view>
        </scroll-view>
      </view>
    </view>
  </view>
</template>


<script>
	import { replaceChineseNums } from '@/utils/translate.js'
	import { debounce } from '@/utils/rateLimiting.js'
	import { getAllPoints } from '@/request/request.js'
	export default {
		props:{
			isShow: Boolean
		},
		data(){
			return {
				mapPoints: [],
				searchedPoints: [],
				searchValue: ''
			}
		},
		methods: {
			handleSearch: debounce(function(e) {
				if (e?.detail?.value !== undefined) {
				  const value = replaceChineseNums(e.detail.value);
				  this.searchValue = value
				  this.searchedPoints = this.mapPoints.filter(point => 
				  point.tags.some(tag => tag.includes(value)) || point.title.includes(value))
				}
			}, 1000),
		},
		onLoad() {
			getAllPoints().then(res => {
				const { data } = res
				this.mapPoints = data
				this.searchedPoints = data
			})
		}
	}
</script>
