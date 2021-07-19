<template>
	<view class="container">
	
		<view class="content">
			<rich-text :nodes="subText"></rich-text>
		</view>
		<view class="warning">
			请仔细阅读，对其内容及事项无异议后方可开始网上选房。
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
			userInfo: '',
			subText: '' //富文本内容
			}
		},
		onLoad() {
			this.userInfo = uni.getStorageSync('userInfo') || ''
			this.getInfo()
		},
		methods: {
			getInfo() {
				console.log(this.userInfo.projectNo);
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
