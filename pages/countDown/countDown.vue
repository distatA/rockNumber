<template>
	<view class="container" style="background: #F9F9F9;">
		<view class="projectTitleBox">
			<view class="title">
				{{userInfo.projectName}}
			</view>
			<view class="titleTips">
				登记即将开始
			</view>
		</view>
		<view class="countDownBox">
			<view class="countDownTips">
				线上选房即将开始
			</view>
			<view class="countDownTime">
				{{time}}
			</view>
		</view>
		<view class="openTime">
			<view class="timeItem">
				<text class="font">开始时间</text>
				<text class="time">{{projectOpenTime}}</text>
			</view>
			<view class="timeItem">
				<text class="font">截止时间</text>
				<text class="time">{{projectEndTime}}</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				userInfo: '',
				time: '',
				timer: '',
				projectOpenTime: '',
				projectEndTime: ''
			}
		},
		onShow() {
			this.userInfo = uni.getStorageSync('userInfo') || ''
			this.userInfo ?  this.computeTime() : ''
			if(!this.userInfo){
				uni.reLaunch({
					url:'../login/login'
				})
			}
		},
		methods: {
			// 判断是否开盘,开盘就跳转
			judgeOpen() {
				var judgeOpenTime = (new Date(this.userInfo.projectOpenTime.replace(/-/g, "/"))).getTime(); //开盘时间
				var judgeEndTime = (new Date(this.userInfo.projectEndTime.replace(/-/g, "/"))).getTime(); //结束时间
				let judgeNowTime = new Date().getTime() //现在的时间
				if (judgeNowTime > judgeOpenTime) {
					clearInterval(this.timer)
					uni.switchTab({
						url: '/pages/index/index'
					})
				}
			},
			// 计算倒计时
			computeTime() {
				var openTime = (new Date(this.userInfo.projectOpenTime.replace(/-/g, "/"))).getTime(); //开盘时间
				var endTime = (new Date(this.userInfo.projectEndTime.replace(/-/g, "/"))).getTime(); //结束时间
				let nowTime = new Date().getTime() //现在的时间
				this.projectOpenTime = this.specialTime(openTime)
				this.projectEndTime = this.specialTime(endTime)
				if (nowTime < openTime) {
					this.timer = setInterval(() => {
						this.time = this.countDown(openTime)
						this.judgeOpen()
					}, 1000)
				} else if (nowTime > openTime && nowTime < endTime) {
					this.time = '已开盘'
					uni.switchTab({
						url: '/pages/index/index'
					})
				}else if (nowTime > endTime){
					this.time = '已结束'
					uni.switchTab({
						url: '/pages/index/index'
					})
				}
			},
		},
		onHide() {
			clearInterval(this.timer)
		}
	}
</script>

<style scoped lang="less">
	.container {
		width: 100vw;
		height: 100vh;
	}

	.projectTitleBox {
		width: 100vw;
		height: 252rpx;
		background: url('../../static/icon/title.png') no-repeat 50% 100%;

		.title {
			text-align: center;
			margin: 75rpx auto 22rpx;
			font-size: 52rpx;
			color: #6337CC;

		}

		.titleTips {
			text-align: center;
			margin: 0 auto;
			font-size: 28rpx;
			color: #777777;
		}
	}

	.countDownBox {
		box-sizing: border-box;
		position: relative;
		left: 40rpx;
		top: -60rpx;
		width: 670rpx;
		height: 260rpx;
		background: #FFFFFF;
		box-shadow: 0px 4rpx 20rpx 6rpx rgba(220, 220, 220, 0.5);
		border-radius: 8rpx;
		padding-top: 50rpx;

		.countDownTips {
			text-align: center;
			margin-bottom: 30rpx;
			font-size: 28rpx;
			color: #777777;
		}

		.countDownTime {
			text-align: center;
			font-size: 70rpx;
			color: #6337CC;
		}
	}

	.openTime {
		padding: 0 20rpx;
		box-sizing: border-box;
		position: relative;
		left: 40rpx;
		top: -20rpx;
		width: 670rpx;
		height: 260rpx;
		background: #FFFFFF;
		box-shadow: 0px 4px 20px 4px rgba(220, 220, 220, 0.5);
		border-radius: 8rpx;
		display: flex;
		flex-direction: column;
		align-items: center;

		.timeItem {
			margin-top: 45rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			width: 100%;

			.font {
				font-size: 28rpx;
				color: #777777;
			}

			.time {

				font-size: 28rpx;
				color: #6337CC;

			}
		}
	}
</style>
