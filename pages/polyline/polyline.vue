<template>
	<view>
		<map class="fullWidth fullHeight"
		subkey="GTHBZ-4MB64-HHXU7-X53B2-PNOO6-ISBQV"
		:latitude="latitude" 
		:longitude="longitude"
		:scale="scale"
		:polyline="polyline"
		:markers="markerPoints"
		show-location=true
		enable-overlooking=true
		enable-traffic=true
		enable-building=true
		enable-3D=true>
		<view class="fullWidth text-center text-lg text-brown margin-top-lg">路线仅供参考，请以实际路况为准</view>
		</map>
		<loading-model ref="loading" />
	</view>
</template>

<script type="module">
	import { getAllConfigs, getAllPoints } from '@/request/request.js'
	import loadingModel from '@/components/loadingModel.vue'
	import QQMapWX from '@/mapSdk/qqmap-wx-jssdk.min.js'
	let ustlMap = null
	export default {
		components:{
			loadingModel
		},
		data() {
			return {
				latitude: 0,
				longitude: 0,
				scale: 16,
				markerPoints: [],
				polyline:[],
			}
		},
		methods: {
			getRoute(sta, des){
					const _this = this;
					ustlMap.direction({
					  mode: 'walking',
					  from: sta,
					  to: des, 
					  success: function (res) {
					    let coors = res.result.routes[0].polyline, pl = [];
					    for (let i = 2; i < coors.length; i++) {
					      coors[i] = Number(coors[i - 2]) + Number(coors[i]) / 1000000;
					    }
					    for (let i = 0; i < coors.length; i += 2) {
					      pl.push({ latitude: coors[i], longitude: coors[i + 1] })
					    }
						_this.polyline = [{
							points: pl,
							color: "#0099FF",
							borderColor: "#0099ee",
							width: 7,
							arrowLine: true,
						}]
					  }
					});
				},
				setPoints(destination){
					const _this = this
					uni.getLocation({
						type: 'gcj02',
						geocode:true,
						isHighAccuracy:true,
						success(res) {
							const { latitude, longitude } = res
							_this.latitude = latitude
							_this.longitude = longitude
							_this.markerPoints = [
								{
									id:1,
									width:20,
									height:20,
									latitude: latitude,
									longitude: longitude,
									iconPath:"https://mp-a5d88437-e406-4713-bb9d-68cc378a8f89.cdn.bspapp.com/cloudstorage/efd061ed-9bfe-4076-a87f-ca8b6758be4f.png"
								},
								{
									id:2,
									width:20,
									height:20,
									latitude: destination.latitude,
									longitude: destination.longitude,
									iconPath:"https://mp-a5d88437-e406-4713-bb9d-68cc378a8f89.cdn.bspapp.com/cloudstorage/842002bf-e928-424a-b5de-5b6a72b34d10.png"
								}
							]
							
							const sta = `${latitude},${longitude}`
							const des = `${destination.latitude},${destination.longitude}`
							_this.getRoute(sta,des)
						},
					})
				}
			},
		onLoad(option) {
			this.$refs.loading.showLoading('规划中')
			ustlMap = new QQMapWX({ key:"GTHBZ-4MB64-HHXU7-X53B2-PNOO6-ISBQV" })
			const { destination } = option
			getAllConfigs().then(res => {
				const { defaultPosition } = res
				this.latitude = defaultPosition.latitude
				this.longitude = defaultPosition.longitude
			})
			this.setPoints(JSON.parse(destination))
			this.$refs.loading.hideLoading()
		},
		onUnload(){
			ustlMap = null
		},
		onShareAppMessage() {
			return {
			  title: '辽科大乱走不迷路，肆意任性逛校园，快来探索校园吧！',
			  path: '/pages/index/index',
			  imageUrl:'https://mp-a6ec9d4b-3d39-473b-b039-90be1a4856a8.cdn.bspapp.com/cloudstorage/b6c32d5b-688e-435d-bee3-1fa3f05ec719.png',
			}
		}
	}
</script>
