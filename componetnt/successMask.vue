<template>
	<!-- 选房成功弹出层 -->
	<view class="successMask"  v-if="showOrderMask">
		<view class="success">
			<view class="successTop">
				<view><text style="font-size: 32rpx;">{{info.houseNo}}</text></view>
				<view><text>户 型:</text><text>({{info.houseType}}){{info.houseNo}}{{info.buildArea}}㎡</text></view>
				<view><text>总 价：</text><text>{{info.houseTotalPrice}}元</text></view>
			</view>
			<text style="font-size: 32rpx; margin-top: 44rpx;text-align: center;">订单号：{{info.orderNo}}</text>
			<text style="margin-top: 25rpx;">请按流程办理认购手续，谢谢配合！</text>
			<text style="margin-top: 62rpx;font-size: 24rpx;">选房信息会以短信形式发送到您的手机！</text>
			<text style="font-size: 24rpx;margin-top: 22rpx;text-align: center;">{{info.nowTime}}</text>
			<image src="../static/icon/close.png" class="orderClose" @click="showOrderMask = 0"></image>
		<view class="orderBtn" @click="toOrderDetail(info.orderNo)">
			订单详情
		</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: ['info', 'showOrderMask'],
			data(){
				return {
					data:''
				}
			},
			methods:{
				// 跳转订单详情
				toOrderDetail(e) {
					uni.navigateTo({
						url: `/pages/orderDetail/orderDetail?orderNo=${e}`
					})
				}
			}
	}
	
</script>

<style scoped lang="less">
	
	.successMask {
		position: fixed;
		top: 0;
		left: 0;
		background-color: rgba(155, 155, 155, 0.8);
		height: 100vh;
		width: 100%;
		z-index: 2;
	}
	
	.success {
		box-sizing: border-box;
		padding: 0 65rpx;
		margin: 20rpx auto;
		width: 590rpx;
		height: 880rpx;
		background: url('https://firsthouse.oss-cn-shanghai.aliyuncs.com/diyifang/20201207/4fd9096df9274a6f9348d25db036b322.png') no-repeat;
		background-size: 590rpx 880rpx;
		display: flex;
		flex-direction: column;
		font-size: 28rpx;
		color: #FFFFFF;
		position: relative;
	
		.successTop {
			margin-top: 280rpx;
			width: 100%;
			height: 226rpx;
			display: flex;
			flex-direction: column;
			justify-content: space-around;
			border-bottom: 4rpx solid #FFFFFF;
			padding-bottom: 30rpx;
		}
	
		.orderClose {
			z-index: 2;
			width: 40rpx;
			height: 40rpx;
			position: absolute;
			right: calc(590rpx / 2 - 20rpx);
			bottom: -60rpx;
		}
		.orderBtn {
			position: absolute;
			bottom: -190rpx;
			left: calc((590rpx - 500rpx)/ 2);
			width: 500rpx;
			height: 80rpx;
			background: #6337CC;
			border-radius: 10rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 36rpx;
			color: #FFFFFF;
		}
	}
</style>
