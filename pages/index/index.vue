<template>
	<view>
		<scroll-view scroll-x class="bg-white nav light text-df animation-fade">
			<view class="flex text-center">
				<view class="cu-item flex-sub" :class="index == tabIndex ? 'text-blue cur' : '' " 
				v-for="(item, index) in types" :key="item.id" :data-id="index" @click="tabSelect">
					{{item}}
				</view>
			</view>
		</scroll-view>
		<map class="fullWidth animation-fade relative"
		style="overflow: hidden; height: 95vh"
		subkey="填写自己的地图key"
		:latitude="latitude" 
		:longitude="longitude"
		:scale="scale"
		:markers="markerPoints"
		@markertap="moveSelectMapLocation"
		@tap="hidePopup(0)"
		min-scale=14
		:skew="skew"
		show-location=true
		enable-overlooking=true
		enable-traffic=true
		enable-building=true
		enable-3D=true>
			<!-- 右下角按钮 -->
			<view class="absolute bg-white btnList shadow flex flex-direction align-center justify-around round">
				<view class="cu-avatar round btn"
				style="background-image:url(https://mp-a6ec9d4b-3d39-473b-b039-90be1a4856a8.cdn.bspapp.com/cloudstorage/d742eb9b-5c29-4e67-997c-99bfaf5da526.png);" 
				@click="showPopup(1)" />
				<view class="cu-avatar round btn"
				style="background-image:url(https://mp-a6ec9d4b-3d39-473b-b039-90be1a4856a8.cdn.bspapp.com/cloudstorage/98afcb24-81b2-4e6e-a932-1c47cfc8c16f.png);" 
				@click="refreshMapPoint"/>
				<view class="cu-avatar round btn"
				style="background-image:url(https://mp-a6ec9d4b-3d39-473b-b039-90be1a4856a8.cdn.bspapp.com/cloudstorage/bd25bc74-5f59-4b2e-bc38-f0fce63b077a.png);" 
				@click="moveUserLocation" />
			</view>
			<!-- 信息标签 -->
			<view class="absolute bg-white detail shadow round-sm" @click.stop="">
				<detail-popover 
				:isShow="popups[0]"
				:select-point="selectLocation" 
				@select-map-route="selectMapRoute" />
			</view>
		</map>
		<search-popover
		:isShow="popups[1]"
		@hidePopup="hidePopup"
		@moveSelectListLocation="moveSelectListLocation" />
		<loading-model ref="loading" />
	</view>
</template>
<script>
	//引入数据获取方法和节流
	import { getAllPoints, getAllConfigs } from '@/request/request.js'
	import { throttle } from '@/utils/rateLimiting.js'
	//引入弹窗组件
	import detailPopover from '@/components/detailPopover.vue'
	import searchPopover from '@/components/searchPopover.vue'
	import loadingModel from '@/components/loadingModel.vue'
	export default {
		components:{ detailPopover, searchPopover, loadingModel },
		data() {
			return {
				//地图操作数据
				latitude: 0,
				longitude: 0,
				scale: 15,
				skew: 0,
				markerPoints: [],
				//所有默认地图数据
				mapPoints: [],
				defaultPosition: null,
				types: [],
				//当前选择点
				selectLocation: null,
				//控制显示数据
				tabIndex: 0,
				// 0号为detail的，1为search的
				popups: [false, false]
			}
		},
		methods:{
			//显示 0号为detail的，1为search的
			showPopup(index = -1){
				if(index === -1){
					this.popups[0] = true
					this.popups[1] = true
				}
				else{
					this.popups[index] = true	
				}
			},
			//隐藏 0号为detail的，1为search的
			hidePopup(index = -1){
				if(index === -1){
					this.popups[0] = false
					this.popups[1] = false
				}
				else{
					this.popups[index] = false	
				}
			},
			//头部导航处理函数，根据id显示不同地图信息
			tabSelect(e){
				if (e?.target?.dataset?.id !== undefined) {
				  const index = e.target.dataset.id
				  this.tabIndex = index
				  this.markerPoints = (index === 0) 
				  ? this.mapPoints : this.mapPoints.filter(point => point.type === this.types[index])
				}
			},
			//地图标记移动函数
			moveLocation(selectedId){
				if (selectedId != undefined && this.markerPoints.length > 0) {
				  const selectedMarker = this.markerPoints.find(marker => marker.id === selectedId)
				  if (selectedMarker) {
					const { latitude, longitude, id } = selectedMarker
					this.showPopup(0)
					this.selectLocation = selectedMarker
					this.latitude = latitude
					this.longitude = longitude
					this.scale = 18
					this.skew = 20
					setTimeout(() => this.scale = 16, 500)
					setTimeout(() => this.skew = 0, 800)
				  }
				}
			},
			//点击搜索的标记处理函数,将上面导航恢复到全部，到达选择的地点
			moveSelectListLocation(id) {
				this.hidePopup()
				if(id != undefined){
					this.$refs.loading.showLoading()
					this.markerPoints = this.mapPoints
					this.tabIndex = 0
					this.moveLocation(id)
					this.$refs.loading.hideLoading(0)
				}
			},
			//点击地图上的标记处理函数
			moveSelectMapLocation: throttle(function(e){
				if(e && e.markerId != undefined){
					this.$refs.loading.showLoading()
					this.moveLocation(e.markerId)
					this.$refs.loading.hideLoading(0)
				}
			}, 100),
			//用户定位函数
			moveUserLocation: throttle(function(){
				this.$refs.loading.showLoading()
				const _this = this 
				uni.getLocation({
					type: 'gcj02',
					geocode: true,
					isHighAccuracy: true,
					success(res) {
						const { latitude, longitude } = res
						_this.latitude = latitude
						_this.longitude = longitude
						_this.scale = 18
						setTimeout(()=> _this.scale = 16 ,500)
					}
				})
				this.$refs.loading.hideLoading(0)
			}, 100),
			//回到地图原点位置
			refreshMapPoint: throttle(function(){
				this.hidePopup()
				this.latitude = this.defaultPosition.latitude
				this.longitude = this.defaultPosition.longitude
				this.scale = 18
				setTimeout(() => this.scale = 16 ,500)
			}, 200),
			//规划路线跳转
			selectMapRoute: throttle(function(){
				if(this.selectLocation !== null){
					const destination = {
						latitude: this.selectLocation.latitude,
						longitude: this.selectLocation.longitude
					}
					uni.navigateTo({
						url:`/pages/polyline/polyline?destination=${JSON.stringify(destination)}`
					})
				}
			},1000),
		},
		//获取所有的配置和地点信息
		onLoad() {
			this.$refs.loading.showLoading()
			getAllConfigs().then(res => {
				const { defaultPosition, types } = res
				this.latitude = defaultPosition.latitude
				this.longitude = defaultPosition.longitude
				this.defaultPosition = defaultPosition
				this.types = types
			})
			getAllPoints().then(res => {
				const { data } = res
				this.mapPoints = data
				this.markerPoints = data
			})
			this.$refs.loading.hideLoading()
		},
		//分享函数
		onShareAppMessage() {
			return {
			  title: '大学乱走不迷路，肆意任性逛校园，快来探索校园吧！',
			  path: '/pages/index/index',
			  imageUrl:'https://mp-a6ec9d4b-3d39-473b-b039-90be1a4856a8.cdn.bspapp.com/cloudstorage/b6c32d5b-688e-435d-bee3-1fa3f05ec719.png',
			}
		}
	}
</script>

<style>
	.btnList {
		width: 11vw; 
		height: 20vh; 
		right: 3%; 
		bottom: 30%; 
		transform: translate(0, -50%)
	}
	.detail {
		left: 50%; 
		bottom: 10%; 
		transform: translate(-50%); 
		overflow-y: scroll;
		white-space: nowrap; 
		z-index:10
	}
</style>