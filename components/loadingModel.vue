<template>
	<view class="animation-scale-up cu-load load-modal" v-if="isShow">
		<view class="gray-text">{{message}}</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				isShow: false,
				message: '加载中'
			}
		},
		methods: {
			showLoading(message = '加载中'){
				this.isShow = true
				this.message = message
			},
			hideLoading(time = 1200){
				setTimeout(() => {
					this.isShow = false
				},time)
			}
		}
	}
</script>