<template>
  <view class="dataModel" v-if="isShow">
    <view class="margin-tb-sm text-black text-center">{{ selectPoint.title }}</view>
		<view class="align-center flex justify-center margin-tb-xl">
		  <view class="cu-tag line-orange margin-left-xs round sm" v-for="(tag, index) in selectPoint.tags" :key="index">
			{{ tag }}
		  </view>
		</view>
    <view class="flex align-center justify-center margin-top-lg text-lg" style="width: 100%;">
		<view class="margin-lr-sm text-brown">规划参考路线</view>
		<view @click="$emit('selectMapRoute')" class="cu-avatar sm round" 
		  style="background-image: url(https://mp-a6ec9d4b-3d39-473b-b039-90be1a4856a8.cdn.bspapp.com/cloudstorage/324b79b4-7af5-4176-802b-7aa82573f6d2.png);" />
		</view>
    </view>
</template>

<script>
	export default {
		props:{ 
			selectPoint: Object,
			isShow: Boolean
		}
	}
</script>

<style>
	.dataModel{
		width: 85vw; 
		height: 22vh;
	}
</style>