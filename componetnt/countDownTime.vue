<template>
	<!-- 倒计时 -->
	<view class="countDown">
		<text>选房结束倒计时</text>
		<text class="time">{{data}}</text>
		<view :class="status ? 'active' : 'check' "  v-if="isShow" @click="changeStatus" >
			只看未选
		</view>
	</view>
</template>

<script>
	export default {
		props: ['data', 'isShow'],
		data() {
			return {
				status: false
			}
		},
		methods: {
			changeStatus(e) {
				this.status = !this.status
				this.$emit("getChild",this.status);
			}
		}

	};
</script>

<style scoped lang="less">
	.countDown {
		transition: all 0.3;
		box-sizing: border-box;
		position: relative;
		top: 0;
		left: 0;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 40rpx;
		width: 100vw;
		height: 80rpx;
		background: rgba(38, 135, 251, 0.2);
		font-size: 28rpx;
		color: #000000;

		.time {
			margin-left: 5rpx;
			font-size: 36rpx;
			flex: 1;
			color: #6337CC;
		}

		.check {
			width: 134rpx;
			height: 52rpx;
			border-radius: 10rpx;
			border: 2rpx solid #717171;
			font-size: 28rpx;
			color: #717171;
			display: flex;
			align-items: center;
			justify-content: center;
		}

		.active {
			color: #6337CC;
			border: 2rpx solid #6337CC;
			display: flex;
			align-items: center;
			justify-content: center;
			width: 134rpx;
			height: 52rpx;
			border-radius: 10rpx;
			font-size: 28rpx;
		}
	}
</style>
