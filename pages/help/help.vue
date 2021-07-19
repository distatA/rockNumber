<template>
	<view class="container">
		<!-- <view class="title">
			选房须知
		</view> -->
		<view class="content">
			<rich-text :nodes="subText"></rich-text>
		</view>
		<view class="warning">
			请仔细阅读，对其内容及事项无异议后方可开始网上选房。
		</view>
		<view class="detail">
			<view class="userName">
				客户姓名： {{userInfo.name}}
			</view>
			<view class="phoneNum">
				电话号码： {{userInfo.mobile}}
			</view>
			<view class="userID">
				证件号码：{{userInfo.cid}}
			</view>
			<view class="isAgreeBox" :style="isAgree ? 'color: #6337CC;' : ''" @click="handleAgree">
				<image src="../../static/icon/isAgree.png" class="agreeImg" v-if="isAgree == true" mode=""></image>
				<image src="../../static/icon/disAgree.png" class="agreeImg" v-else mode=""></image>
				<view class="isAgreeFont">
					我已同意阅读协议
				</view>
			</view>
		</view>
		<view style="width: 100%;height: 90rpx;">

		</view>
		<view class="bottomBar">
			<view class="disagree" @click="gotoBack">
				不同意
			</view>
			<view class="agree" @click="toPage">
				同意
			</view>
		</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				isAgree: false, //是否阅读协议
				userInfo: '',
				subText: '', //富文本内容
				userInfo: ''
			}
		},
		onLoad() {
			this.userInfo = uni.getStorageSync('userInfo') || ''
			this.getInfo()
		},
		methods: {
			handleAgree() {
				this.isAgree = !this.isAgree
			},
			getInfo() {
				if (this.userInfo.projectNo) {

					this.$http({
						url: '/openUser/agreement',
						mtthod: 'GET',
						data: {
							projectNo: this.userInfo.projectNo
						}
					}).then(res => {
						if (res.code === 0) {
							this.subText = res.subText
						} else {
							uni.showToast({
								title: res.msg,
								icon: 'none'
							})
						}
					})
				}
			},
			// 跳转
			toPage() {
				if (this.isAgree) {
					if (this.userInfo.hasOpenId === 1) {
					this.judeOpen()
					} else {
						let that = this
						uni.login({
							provider: 'weixin',
							success: function(r) {
								that.getOpenId(r.code, that.userInfo.userNo, that.userInfo.isKfs)
							}
						});
					}

				} else {
					uni.showToast({
						title: '请点击已同意阅读协议',
						icon: 'none'
					})
				}

			},
			// 判断是否开盘
			judeOpen() {
				// 未开始跳倒计时页面,开始跟结束都到列表
				var openTime = (new Date(this.userInfo.projectOpenTime.replace(/-/g, "/"))).getTime(); //开盘时间
				var endTime = (new Date(this.userInfo.projectEndTime.replace(/-/g, "/"))).getTime(); //结束时间
				let nowTime = new Date().getTime() //现在的时间
				if (nowTime < openTime) {
					uni.navigateTo({
						url: '/pages/countDown/countDown'
					})
				} else {
					uni.switchTab({
						url: '/pages/index/index'
					})
				}
			},
			// 获取openId
			getOpenId(code, userId, isKfs) {
				this.$http({
					url: '/openUser/getCode',
					method: 'POST',
					data: {
						code,
						userId,
						isKfs
					}
				}).then(res => {
					if (res.code === 0) {
						let userInfo = uni.getStorageSync('userInfo');
						userInfo.hasOpenId = 1
						this.userInfo = userInfo
						uni.setStorageSync('userInfo', userInfo);
						this.judeOpen()
					} else {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
					}
				})
			},
			gotoBack() {
				uni.navigateBack({
					delta: 1
				})
			}
		}

	}
</script>

<style lang="less" scoped>
	.container {
		padding: 0 40rpx;

		.title {
			font-size: 36rpx;
			font-weight: 600;
			text-align: center;
			margin: 24rpx 0;
		}

		.content {
			margin-top: 30rpx;
			text-align: justify;
			font-size: 28rpx;
		}

		.warning {
			font-size: 28rpx;
			color: #FF0000;
			margin: 20rpx 0;
		}

		.detail {
			box-sizing: border-box;
			width: 670rpx;
			height: 296rpx;
			background: #ECECEC;
			font-size: 28rpx;
			color: #000000;
			padding: 20rpx;
			display: flex;
			flex-direction: column;
			justify-content: space-around;
			margin-bottom: 40rpx;
		}

		.isAgreeBox {
			font-size: 28rpx;
			color: #bdbebf;
			display: flex;
			align-items: center;

			.agreeImg {
				margin-right: 20rpx;
				width: 28rpx;
				height: 28rpx;
			}
		}

		.active {
			color: #6337CC;
		}

		.bottomBar {
			position: fixed;
			left: 0;
			bottom: 0;
			width: 100vw;
			height: 90rpx;
			display: flex;
			align-items: center;

			.disagree {
				height: 100%;
				flex: 1;
				display: flex;
				align-items: center;
				justify-content: center;
				font-size: 36rpx;
				color: #000000;
				background: #ECECEC;

			}

			.agree {
				height: 100%;
				display: flex;
				align-items: center;
				justify-content: center;
				font-size: 36rpx;
				color: #FFFFFF;
				flex: 1;
				background: #6337CC;

			}
		}
	}
</style>
