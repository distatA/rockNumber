<template>
	<view class="container" v-if="info">
		<view class="info">
			<view class="info_font">
				<text style="font-size: 32rpx;">{{info.houseNo}}</text>
				<text>({{info.houseType || '' }}){{info.houseName  || ''}} {{info.buildArea || ''}}㎡</text>
				<text>{{info.houseTotalPrice.toFixed(2)}}元</text>
			</view>
			<image :src="info.houseImage" mode="" class="info_pic" v-if="info.houseImage"></image>
		</view>
		<view class="brief">
			到【{{userInfo.projectName}}项目销售部】办理剩下手续，逾期未办理视为自动放弃，已收取的认筹金不予退还，且我司有权将此房屋另售他人，不再另行通知！
		</view>
		<view class="userPoint">
			<view>
				<text class="mr">订单号：</text>
				<text>{{info.orderNo}}</text>
			</view>
			<view>
				<text class="mr">选房时间:</text>{{info.createTime}}
			</view>
			<view>
				<text class="mr">支付金额:</text>{{info.payMoney.toFixed(2)}}元
			</view>
		</view>
		<view class="userInfo">
			<view>
				<text class="mr">户型结构:</text>({{info.houseType || ''}}){{info.houseName || ''}}
			</view>
			<view>
				<text class="mr">建筑面积:</text>{{returnFloat(info.buildArea)}}㎡
			</view>
			<view>
				<text class="mr">套内面积:</text>{{returnFloat(info.buildInArea)}}㎡
			</view>
		</view>
		<view class="userDetail">
			<view>
				<text class="mr">客户姓名:</text>{{info.name}}
			</view>
			<view>
				<text class="mr">手机号码:</text>{{info.mobile}}
			</view>
			<view>
				<text class="mr">证件号码:</text>{{info.cid}}
			</view>
		</view>
		<view class="time">
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				data: '',
				userInfo:'',
				info:''
			}
		},
		onLoad(options) {
			this.userInfo = uni.getStorageSync('userInfo');
			this.getList(options.orderNo)
		console.log(this.returnFloat(140.1));
		},
		methods: {
			// 获取订单详情
			getList(orderId) {
				this.$http({
					url: '/openHouse/orderInfo',
					method: 'GET',
					data: {
						orderId,
					}
				}).then(res => {
					if (res.code === 0) {
						this.info = res.info 
					} else {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
					}
				})
			}
		}
	}
</script>

<style lang="less" scoped>
	.container {
		font-size: 28rpx;
	}

	.info {
		background: #6337CC;
		box-sizing: border-box;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 30rpx 40rpx;
		height: 260rpx;
		font-size: 28rpx;
		color: #FFFFFF;

		&_font {
			flex-direction: column;
			height: 100%;
			display: flex;
			justify-content: space-around;
			flex: 1;
		}

		&_pic {
			width: 200rpx;
			height: 200rpx;
			border-radius: 10rpx;

		}
	}

	.brief {

		font-size: 28rpx;
		padding: 10rpx 40rpx;
		border-bottom: 6rpx solid #F3F3F3;
	}

	.userPoint {
		padding: 0 40rpx;
		background-color: #fffff;
		height: 165rpx;
		width: 100%;
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		border-bottom: 4rpx solid #F3F3F3;
	}

	.userInfo {
		padding: 0 40rpx;
		height: 212rpx;
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		margin-bottom: 8rpx;
		border-bottom: 4rpx solid #F9F9F9;
	}

	.userNumber {
		height: 82rpx;
		padding: 0 40rpx;
		display: flex;
		align-items: center;
		font-size: 32rpx;
		font-weight: 400;
		color: #000000;
		border-bottom: 4rpx solid #F9F9F9;
	}

	.userDetail {
		padding: 0 40rpx;
		height: 200rpx;
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		// border-bottom: 4rpx solid #F9F9F9;
	}

	.time {
		height: 90rpx;
		padding: 0 40rpx;
		display: flex;
		align-items: center;
	}

	.mr {
		margin-right: 20rpx;
	}
</style>
