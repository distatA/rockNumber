<template>
	<view class="container">
		<!-- 倒计时 -->
		<countDownTime :data='time' />
		<!-- 备选列表 -->
		<view class="house_item" v-for="(item,index) in list" :key="index" @click="toDetail(item)">
			<view class="house_name">
				<image src="../../static/icon/houseIcon.png" class="houseImg" mode=""></image>
				<text class="title">{{item.unitFloorCode}}</text>
			</view>
			<view class="houseType">
				<view>
					户 型: <text class="houseTypeDetail">{{item.houseTypeDesc ?  item.houseTypeDesc :  '暂无户型' }} {{ returnFloat(item.area)}}㎡</text>
				</view>
				<view class="buy" @click.native.stop="subBuy(item)" v-if="item.isBuy === 0 ">
					认购
				</view>
				<view class="buy" style="background: #717171;" v-if="item.isBuy === 1 ">
					已失效
				</view>
			</view>
			<view class="houseMoney">
				总 价: <text style="color: #FF0000;margin-left: 10rpx;">{{item.allPrice.toFixed(2)}}元</text>
			</view>
		</view>
		<!-- 认购弹出框 -->
		<view class="popupMask" v-if="isShowMask">
			<view class="popupBox">
				<image src="../../static/icon/close.png" class="close" @click="isShowMask = false"></image>
				<view class="title">
					确认订单
				</view>
				<view class="popupDetail">
					<view>{{!userInfo.proCity  ?  '' : ' [' + userInfo.proCity+']'}} {{userInfo.projectName}}</view>
					<view class="houseName">{{info.unitFloorCode}}</view>
					<view><text class="orderInfoName">房源总价：</text> {{info.allPrice}}元</view>
					<view><text class="orderInfoName">户型结构：</text> {{info.houseTypeDesc  ?  info.houseTypeDesc :  '暂无户型' }} {{info.area}}㎡</view>
					<view><text class="orderInfoName">客户姓名：</text> {{userInfo.name}}</view>
					<view><text class="orderInfoName">手机号码：</text> {{userInfo.mobile}}</view>
					<view><text class="orderInfoName">证件号码：</text> {{userInfo.cid}}</view>
				</view>
				<view class="argee" @click="clickAgree">
					<image src="../../static/icon/disAgree.png" class="argeeImg" v-if="!isAgree"></image>
					<image src="../../static/icon/isAgree.png" class="argeeImg" v-else></image>
					<view class="argeeFont" :style="isAgree ?' color : #6337CC;': ''  ">我已阅读并同意<text @click.native.stop="toEvent">《在线活动须知》</text></view>
				</view>
				<view class="btn" @click="confirmOrder">确定</view>
			</view>
		</view>
		<!-- 选房成功弹出层 -->
		<view class="successMask" v-if="showOrderMask">
			<view class="success">
				<view class="successTop">
					<view><text style="font-size: 32rpx;">{{info.unitFloorCode}}</text></view>
					<view><text>户 型:</text><text>{{!info.houseTypeDesc  ? '暂无户型': info.houseTypeDesc }} {{info.area}}㎡</text></view>
					<view><text>总 价：</text><text>{{info.allPrice}}元</text></view>
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
	import countDownTime from '../../componetnt/countDownTime'
	import empty from '../../componetnt/empty'
	export default {
		data() {
			return {
				time: '', //倒计时
				isAgree: false, // 是否同意阅读协议
				isShowMask: false, //是否显示遮罩层
				userInfo: '',
				showOrderMask: false, //显示选房成功
				pageSize: 5,
				pageNum: 1,
				list: [],
				info: '', //选房弹出框的信息
				roomNo: '', //当前点击认购的房间id
				token: '', //支付订单需要的token
				orderNo: '', //订单号
				notTime: ''
			}
		},
		components: {
			countDownTime,
			empty
		},
		onLoad() {
			this.userInfo = uni.getStorageSync('userInfo') || ''
		},
		onShow() {
			this.getList()
			this.computeTime()
		},
		methods: {
			//认购点击事件
			clickAgree() {
				this.isAgree = !this.isAgree
			},
			// 获取列表 
			getList() {
				this.$http({
					url: '/openHouse/alternativeList',
					method: 'GET',
					data: {
						userNo: this.userInfo.userNo,
						pageSize: this.pageSize,
						pageNum: this.pageNum
					}
				}).then(res => {
					if (res.code === 0) {
						this.list = res.page
					} else {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
					}
				})
			},
			// 跳转详情
			toDetail(e) {
				uni.navigateTo({
					url: `/pages/myBackupDetail/myBackupDetail?roomNo=${e.roomNo}`
				})
			},
			// 计算倒计时
			computeTime() {
				var openTime = (new Date(this.userInfo.projectOpenTime.replace(/-/g, "/"))).getTime(); //开盘时间
				var endTime = (new Date(this.userInfo.projectEndTime.replace(/-/g, "/"))).getTime(); //结束时间
				let nowTime = new Date().getTime() //现在的时间
				if (nowTime < openTime) {
					this.time = '未开盘'
					// 现在时间大于开盘时间并小于结束时间就是倒计时
				} else if (nowTime > openTime && nowTime < endTime) {
					// if (this.timer) { clearInterval(this.timer); this.time = ''}
					this.timer = setInterval(() => {
						this.time = this.countDown(endTime)
					}, 1000)
				} else if (nowTime > endTime) {
					clearInterval(this.timer)
					this.time = '已结束'
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
			
			//点击确认
			subBuy(e) {
				this.roomNo = e.roomNo
				this.info = e
				this.info.allPrice = this.info.allPrice.toFixed(2)
				this.info.area =  this.returnFloat(this.info.area)
				this.isShowMask = true
				this.isAgree = false
			},
			// 确认订单
			confirmOrder() {
				if (this.isAgree) {
					this.getToken()
					setTimeout(() => {
						this.createOrder()
					}, 500)

				} else {
					uni.showToast({
						title: '请点击已同意阅读协议',
						icon: 'none'
					})
				}
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
							this.payFn(order)
							this.orderNo = order.orderNo
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
				let {
					wxPayMpOrderResult
				} = await this.wxGet(order.orderNo)
				await this.wxPay(wxPayMpOrderResult)
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
						this.isShowMask = false
						this.showOrderMask = true
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
			// 跳转在线须知
			toEvent(){
				uni.navigateTo({
					url:'../roomRuls/roomRuls'
				})
			}
		},
		onHide() {
			clearInterval(this.timer)
			this.time = ''
		}
	}
</script>

<style lang="less" scoped>
	.container {
		min-height: 100vh;
		background: #F1F1F1;
		.countDown {
			position: relative;
			top: 0;
			left: 0;
			display: flex;
			align-items: center;
			padding-left: 40rpx;
			width: 100vw;
			height: 80rpx;
			background: rgba(38, 135, 251, 0.2);
			font-size: 28rpx;
			color: #000000;

			.time {
				margin-left: 16rpx;
				font-size: 36rpx;
				color: #6337CC;
			}
		}

		.house_item {
			color: #717171;
			padding: 0 40rpx;
			height: 210rpx;
			background: rgba(255, 255, 255, 0.99);
			display: flex;
			flex-direction: column;
			justify-content: space-around;
			margin-bottom: 12rpx;

			.house_name {
				display: flex;
				align-items: center;

				.houseImg {
					width: 40rpx;
					height: 40rpx;
				}
			}

			.houseType {
				display: flex;
				align-items: center;
				justify-content: space-between;

				.buy {
					border-radius: ;
					display: flex;
					align-items: center;
					justify-content: center;
					font-size: 28rpx;
					color: #FFFFFF;
					width: 140rpx;
					height: 60rpx;
					border-radius: 8rpx;
					background-color: #6337CC;
				}
			}
		}
		.houseTypeDetail {
			color: #000000;
			margin-left: 10rpx;
			flex: 1;
		}

		.title {
			font-size: 32rpx;
			color: #000000;
			margin-left: 10rpx;

		}

		.popupMask {

			position: fixed;
			top: 0;
			left: 0;
			background-color: rgba(155, 155, 155, 0.8);
			height: 100vh;
			width: 100%;
			z-index: 2;

			.popupBox {
				box-sizing: border-box;
				position: relative;
				top: calc(100vh - 738rpx);
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
			top: -56rpx;
		}
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
</style>
