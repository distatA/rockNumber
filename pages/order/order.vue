<template>
	<view class="container">
		<view class="order_item" @click="toPage(item.orderNo)" v-for="(item,index) in list" :key="index">
			<view class="userPoint">
				<view class="userTop">
					<text style="font-size: 36rpx; color: #000000;">{{item.name}}</text>
					<text style="margin-left: 30rpx;flex: 1;">{{item.mobile}}</text>
					<!-- 0-待支付  1支付成功 2支付失败-->
					<text style="color: #F79F01;" v-if="item.payStatus == 0 && item.isPay !== 0">待支付</text>
					<text style="color: #6337CC" v-if="item.payStatus == 1 && item.isPay !== 0">支付成功</text>
					<text style="color: #6337CC" v-if="item.isPay == 0">认购成功</text>
					<text style="color: #676767;" v-if="item.payStatus == 2 && item.isPay !== 0">支付失败</text>

				</view>
				<view>
					<text class="mr">证件号码</text>: {{item.cid}}
				</view>
			</view>
			<view class="userInfo">
				<view>
					<text class="mr">诚信单号</text>: {{item.sincerityNumber}}
				</view>
				<view>
					<text class="mr">置业顾问</text>: {{item.consultantName == '' ? '无' : item.consultantName}}
				</view>
				<view>
					<text class="mr">联系电话</text>: {{item.consultantMobile == '' ?'无' : item.consultantMobile}}
				</view>
			</view>
			<view class="userNumber">
				<text class="mr">订单号</text>: {{item.orderNo}}
			</view>
			<view class="userDetail">
				<view>
					<text class="mr">房间</text>: {{item.houseNo}}
				</view>
				<view>
					<text class="mr">房源总价</text> : {{item.houseTotalPrice.toFixed(2)}}元
				</view>

			</view>
			<view class="time">
				<view>{{item.createTime}}</view>
				<view class="goPay" v-if="item.payStatus == 0 && item.isPay == 1" @click.native.stop="confirmOrder(item)">去支付</view>
			</view>
		</view>
		<!-- 选房成功弹出层 -->
		<view class="successMask" v-if="showOrderMask">
			<view class="success">
				<view class="successTop">
					<view><text style="font-size: 32rpx;">{{info.houseNo}}</text></view>
					<view><text>户 型:</text><text>({{info.houseType}}){{info.houseName}}{{returnFloat(info.buildArea)}}㎡</text></view>
					<view><text>总 价：</text><text>{{info.houseTotalPrice.toFixed(2)}}元</text></view>
				</view>
				<text style="font-size: 30rpx; margin-top: 44rpx;">订单号：{{orderNo}}</text>
				<text style="margin-top: 25rpx;">请按流程办理认购手续，谢谢配合！</text>
				<text style="margin-top: 62rpx;font-size: 24rpx;">选房信息会以短信形式发送到您的手机！</text>
				<text style="font-size: 24rpx;margin-top: 22rpx;text-align: center;">{{notTime}}</text>
				<image src="../../static/icon/close.png" class="orderClose" @click="showOrderMask = 0"></image>
				<view class="orderBtn" @click="toOrderDetail(orderNo)">
					订单详情
				</view>
			</view>
		</view>
		<empty v-if="list.length === 0" />
	</view>
</template>

<script>
	import empty from '../../componetnt/empty'
	export default {
		data() {
			return {
				data: '',
				userInfo: '',
				pageSize: 3,
				pageNum: 1,
				list: [],
				totalCount: 0,
				showOrderMask: false,
				notTime: '', //当前时间
				orderNo: '', //订单号
				info: '', //点击的详细信息 
				roomNo: '' //房源编号
			}
		},
		components: {
			empty
		},
		onLoad() {
			this.userInfo = uni.getStorageSync('userInfo');
		},
		onShow() {
			this.pageNum = 1
			this.getList(this.userInfo.userNo, this.pageSize, this.pageNum)
		},
		methods: {
			toPage(e) {
				uni.navigateTo({
					url: `/pages/orderDetail/orderDetail?orderNo=${e}`
				})
			},
			// 获取订单列表 
			getList(userId, pageSize, pageNum) {
				this.$http({
					url: '/openHouse/orderList',
					method: 'GET',
					data: {
						userId,
						pageSize,
						pageNum
					}
				}).then(res => {
					if (res.code === 0) {
						const {
							list,
							totalCount,
							totalPage,
							pageSize,
							currPage
						} = res.page
						if (this.totalCount <= this.list.length) {
							this.totalCount = totalCount
							this.list = list
						} else {
							this.list = [...this.list, ...list]
						}
					} else {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
					}
				})
			},
			// 上拉加载
			onReachBottom() {
				const {
					list,
					totalCount
				} = this
				if (list.length < totalCount) {
					uni.showLoading({
						title: '加载中',
					})
					this.pageNum = this.pageNum + 1
					this.getList(this.userInfo.userNo, this.pageSize, this.pageNum)
					uni.hideLoading()
				} else {
					uni.showToast({
						title: '已经到底了',
						icon: 'none'
					})
				}
			},
			// takeToken
			getToken() {
				this.$http({
					url: '/openHouse/orderToken',
					method: 'GET',
					data: {
						userId: this.userInfo.userNo
					}
				}).then(res => {
					if (res.code === 0) {
						this.token = res.token
					} else {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
					}
				})
			},
			// 确认订单
			confirmOrder(e) {
				this.info = e
				this.roomNo = e.roomNo
				this.getToken()
				this.orderNo = e.orderNo
				setTimeout(() => {
					this.payFn(e)
				}, 500)
			},
			// 创建订单
			createOrder() {
				this.$http({
					url: '/openHouse/submitOrder',
					method: 'POST',
					data: {
						roomNo: this.roomNo,
						userId: this.userInfo.userNo,
						projectNo: this.userInfo.projectNo,
						token: this.token
					}
				}).then(res => {
					if (res.code === 0) {
						const {order} = res
						if (res.isPay == 0) {
							this.orderNo = order.orderNo
							this.isShowMask = false
							this.showOrderMask = true
						} else {
							this.orderNo = order.orderNo
							this.payFn(order)
						}
					} else {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
					}
				})
			},
			// 支付流程
			async payFn(order) {
				let res = await this.wxGet(order.orderNo)
				if (res.code === 0) {
					await this.wxPay(res.wxPayMpOrderResult)
				} else {
					uni.showToast({
						title: res.msg,
						icon: 'none'
					})
				}
			},
			// 请求微信支付的数据
			wxGet(orderNo) {
				return this.$http({
					url: '/openHouse/wxPay',
					method: 'POST',
					data: {
						orderNo
					}
				})
			},
			// 微信支付 
			wxPay(v) {
				uni.requestPayment({
					timeStamp: v.timeStamp,
					nonceStr: v.nonceStr,
					package: v.packageValue,
					signType: v.signType,
					paySign: v.paySign,
					success: (res) => {
						uni.showToast({
							title: "支付成功"
						})
						let nowTime = new Date().getTime() //现在的时间
						this.notTime = this.myTime(nowTime)
						this.showOrderMask = true
						this.getList(this.userInfo.userNo, this.pageSize, this.pageNum)
					},
					fail: (res) => {
						uni.showModal({
							content: "支付失败",
							showCancel: false
						})
					},
					complete: () => {
						this.loading = false;
					}
				})
			},
			// 跳转订单详情
			toOrderDetail(e) {
				uni.navigateTo({
					url: `/pages/orderDetail/orderDetail?orderNo=${e}`
				})
			},
		},
		onHide() {
			this.totalCount = 0
		},
	}
</script>

<style lang="less" scoped>
	.container {
		height: 100vh;
		background: #F1F1F1;
	}

	.order_item {
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		font-size: 28rpx;
		background-color: #ffffff;
		margin-bottom: 12rpx;
	}

	.userPoint {
		box-sizing: border-box;
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
		border-bottom: 8rpx solid #F9F9F9;
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
		height: 150rpx;
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		border-bottom: 4rpx solid #F9F9F9;
	}

	.time {
		height: 90rpx;
		padding: 0 40rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;

		.goPay {
			color: white;
			display: flex;
			align-items: center;
			justify-content: center;
			width: 120rpx;
			height: 50rpx;
			background-color: #6337CC;
			border-radius: 8rpx;
		}

	}

	.mr {
		margin-right: 10rpx;
	}

	.userTop {
		width: 100%;
		display: flex;
		align-items: center;
	}

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
		padding: 0 65rpx 50rpx 65rpx;
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

	.popupMask {

		position: fixed;
		top: 0;
		left: 0;
		background-color: rgba(155, 155, 155, 0.8);
		height: 100vh;
		width: 100%;
		z-index: 2;

		.btn {
			margin-top: 30rpx;
			width: 100%;
			height: 80rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 36rpx;
			color: #FFFFFF;
			background-color: #6337CC
		}

		.close {
			width: 40rpx;
			height: 40rpx;
			position: absolute;
			right: 20rpx;
			top: 310rpx;
		}

		.popupBox {
			box-sizing: border-box;
			position: absolute;
			bottom: 0;
			left: 0;
			padding: 20rpx 0 0 0;
			width: 100vw;
			height: 738rpx;
			background: #FFFFFF;
			display: flex;
			justify-content: space-between;
			flex-direction: column;
		}

		.title {
			text-align: center;
			font-size: 32rpx;
			color: #000000;
			-webkit-text-stroke: 1rpx #000000;
			text-stroke: 1rpx #000000;
			font-weight: 500;
		}

		.popupDetail {
			display: flex;
			flex-direction: column;
			justify-content: space-around;
			flex: 1;
			padding: 0 40rpx;
			font-size: 28rpx;
			color: #000000;

			.houseName {
				font-weight: 500;
				font-size: 32rpx;
				-webkit-text-stroke: 1rpx #000000;
				text-stroke: 1rpx #000000;

			}
		}

		.argee {
			margin-top: 20rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 28rpx;
			color: #bfbfbf;

			.argeeImg {
				margin-right: 10rpx;
				width: 28rpx;
				height: 28rpx;
			}
		}

	}
</style>
