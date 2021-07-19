<template>
	<view class="contianer">
		<countDownTime :data="time" />
		<view class="house_message" v-if="roomInfo">
			<image src="../../static/icon/houseIcon.png" class="house_icon" mode=""></image>
			<view class="house_name">
				{{roomInfo.buildNo}}栋-{{roomInfo.unitNo}}单元-{{roomInfo.floorNo}}层-{{roomInfo.houseNo}}
			</view>
			<view class="backUp" @click="backUp" :style="isBackUp ? 'color:#6337CC;' : '' ">
				<image :src="isBackUp ? '../../static/myBackupFoucs.png' : '../../static/myBackup.png' " class="img" mode=""></image>
				<view class="font">
					加入备选
				</view>
			</view>
		</view>
		<view class="house_detail" v-if="roomInfo">
			<view class="house_item"><text class="titleFont">总 价：</text><text class="importantFont">{{roomInfo.originalAllPrice}}元</text></view>
			<view class="house_item"><text class="titleFont">单 价：</text><text class="importantFont">{{roomInfo.originalPrice}}元/㎡</text></view>
			<!-- <view class="house_item"><text class="titleFont">原总价：</text><text>1,219,988.0元</text></view> -->
			<!-- <view class="house_item"><text class="titleFont">原单价：</text><text>9,988.0元/㎡</text></view> -->
			<view class="house_item"><text class="titleFont">建 面：</text><text>{{ roomInfo.buildArea}}㎡</text></view>
			<view class="house_item"><text class="titleFont">套 面：</text><text>{{ roomInfo.buildInArea}}㎡</text></view>
			<view class="house_item"><text class="titleFont">户 型：</text><text>{{openInfo.houseType && openInfo ? '(' + openInfo.houseType + ')' :  '暂无户型' }}{{openInfo.houseName && openInfo ? openInfo.houseName : ''}}</text></view>
		</view>
		<image :src="openInfo.houseImage" mode="" class="houseImg" v-if="openInfo.houseImage"></image>
		<view class="tabBar">
			<view class="houseList" @click="toIndex">
				<image src="../../static/index.png" class="houseList_img" mode=""></image>
				<view class="houseList_font">房源列表</view>
			</view>
			<view class="mybackUp" @click="toBackUp">
				<image src="../../static/myBackup.png" class="myBackupImg" mode="">
					<view class="redDot" v-if="count > 0">{{count}}</view>
				</image>
				<view>我的备选</view>
			</view>
			<!-- background: #6337CC; -->
			<view class="buy" @click="ShowMask" v-if="roomInfo.isChoose == 0">直接认购</view>
			<view class="buy" v-if="roomInfo.isChoose == 1" :style="roomInfo.myChoose == 0 ? 'background:#717171' : ''">已认购</view>
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
					<view class="houseName">{{roomInfo.buildNo}}栋-{{roomInfo.unitNo}}单元-{{roomInfo.floorNo}}层-{{roomInfo.houseNo}}</view>
					<view><text class="orderInfoName">房源总价：</text>{{roomInfo.originalAllPrice }}元</view>
					<view><text class="orderInfoName">户型结构：</text>  {{openInfo.houseType && openInfo ? '(' + openInfo.houseType +')' :  '' }}{{openInfo.houseName && openInfo ?  openInfo.houseName : ''}}
						{{roomInfo.buildArea}}㎡</view>
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
					<view><text style="font-size: 32rpx;">{{roomInfo.buildNo}}栋-{{roomInfo.unitNo}}单元-{{roomInfo.floorNo}}层-{{roomInfo.houseNo}}</text></view>
					<view><text>户 型:</text><text>{{openInfo.houseType ? '(' + openInfo.houseType + ')': '暂无户型'}}{{openInfo.houseName ? openInfo.houseName : ''}} {{roomInfo.buildArea}}㎡</text></view>
					<view><text>总 价：</text><text>{{roomInfo.originalAllPrice}}元</text></view>
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
	</view>

</template>

<script>
	import countDownTime from '../../componetnt/countDownTime'
	export default {
		data() {
			return {
				time: '', //倒计时
				isBackUp: false, //备选
				isShowMask: false, //是否显示遮罩层
				isAgree: false, // 是否同意阅读协议
				showOrderMask: false, //选房成功
				roomNo: '', //房间号码
				roomInfo: '', //房间信息
				openInfo: '', //开盘信息
				userInfo: '',
				token: '',
				count: '', //备选数量
				notTime: '', //现在的时间
				orderNo: '' //订单号
			}
		},
		components: {
			countDownTime
		},
		onShow() {
		},
		async onLoad(options) {
			this.userInfo = uni.getStorageSync('userInfo');
			this.roomNo = options.roomNo;
			await this.getRoomDetail();
			await this.computeTime()
			await this.getToken();
			await this.getCount()
		},
		methods: {
			//认购点击事件
			ShowMask() {
				this.isShowMask = !this.isShowMask
			},
			clickAgree() {
				this.isAgree = !this.isAgree
			},
			backUp() {
				// console.log(this.roomInfo.isChoose,this.isBackUp);
				if (this.roomInfo.isChoose == 1 && this.isBackUp == false) {
					uni.showToast({
						title: '该房源已被认购，您可以再看看其他房源哦',
						icon: 'none'
					})
				} else {
					this.$http({
						url: '/openHouse/JoinAlternative',
						method: 'POST',
						data: {
							roomNo: this.roomNo,
							userNo: this.userInfo.userNo
						}
					}).then(res => {
						if (res.code === 0) {
							uni.showToast({
								title: '操作成功'
							})
							this.isBackUp = !this.isBackUp
							this.getCount()
						} else {
							uni.showToast({
								title: res.msg,
								icon: 'none'
							})
						}
					})
				}

			},
			// 获取房间信息
			getRoomDetail() {
				this.$http({
					url: '/openHouse/homeInfo',
					method: 'GET',
					data: {
						roomNo: this.roomNo,
						userId: this.userInfo.userNo
					}
				}).then(res => {
					if (res.code === 0) {
						this.roomInfo = res.byId
						this.roomInfo.originalAllPrice = res.byId.originalAllPrice.toFixed(2)
						this.roomInfo.originalPrice = res.byId.originalPrice.toFixed(2)
						this.roomInfo.buildArea =  this.returnFloat(res.byId.buildArea)
						this.roomInfo.buildInArea =  this.returnFloat(res.byId.buildInArea)
						this.openInfo = res.openProHouseTypeEntity
						this.isBackUp = res.flag
					} else {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
					}
				})
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
						const {
							order
						} = res
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
			// 确认订单 
			confirmOrder() {
				if (this.isAgree) {
					this.createOrder()

				} else {
					uni.showToast({
						title: '请点击已同意阅读协议',
						icon: 'none'
					})
				}
			},
			// 获取小数点 
			getCount() {
				this.$http({
					url: '/openHouse/alternativCount',
					method: 'GET',
					data: {
						userNo: this.userInfo.userNo
					}
				}).then(res => {
					if (res.code === 0) {
						this.count = res.count
					} else {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
					}
				})
			},
			// 跳转备选
			toBackUp() {
				uni.switchTab({
					url: '/pages/myBackup/myBackup'
				})
			},
			// 跳转首页 
			toIndex() {
				uni.switchTab({
					url: '/pages/index/index'
				})
			},
			// 跳转订单详情 
			toOrderDetail(e) {
				uni.navigateTo({
					url: `/pages/orderDetail/orderDetail?orderNo=${e}`
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
					this.timer = setInterval(() => {
						this.time = this.countDown(endTime)
					}, 1000)
				} else if (nowTime > endTime) {
					clearInterval(this.timer)
					this.time = '已结束'
				}
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
			// 跳转在线须知 
			toEvent(){
				uni.navigateTo({
					url:'../roomRuls/roomRuls'
				})
			}
		}
	}
</script>

<style lang="less" scoped>
	.house_message {
		box-sizing: border-box;
		width: 100%;
		height: 98rpx;
		border-bottom: 2rpx solid #F9F9F9;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 40rpx;
		font-size: 32rpx;
		color: #000000;
		font-weight: 500;

		.house_icon {
			width: 40rpx;
			height: 40rpx;

		}

		.house_name {
			margin-left: 10rpx;
			flex: 1;
		}

		.backUp {
			height: 100%;
			width: 100rpx;
			display: flex;
			flex-direction: column;
			justify-content: space-around;
			align-items: center;
			font-size: 24rpx;
			font-weight: 400;
			color: #AAAAAA;

			.img {
				width: 38rpx;
				height: 36rpx;

			}

		}

	}

	.house_detail {
		font-size: 28rpx;
		box-sizing: border-box;
		width: 100%;
		height: 240rpx;
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		padding: 15rpx 40rpx 0;

		.titleFont {
			color: #717171;
		}

		.importantFont {
			color: #FF0000;
		}

		.house_item {
			margin-bottom: 25rpx;
			// flex: 1;
			width: 50%;
		}


	}

	.tabBar {
		position: fixed;
		left: 0;
		bottom: 0;
		width: 100%;
		height: 100rpx;
		display: flex;
		background: #FFFFFF;
		box-shadow: 0px -4px 8px 0px rgba(220, 220, 220, 0.5);

		.houseList {
			padding: 5rpx 0;
			width: 25%;
			height: 100%;
			display: flex;
			align-items: center;
			flex-direction: column;
			justify-content: space-around;
			font-size: 24rpx;
			color: #BFBFBF;
			box-sizing: border-box;

			.houseList_img {
				width: 44rpx;
				height: 44rpx;
			}
		}

		.mybackUp {
			box-sizing: border-box;
			padding: 5rpx 0;
			width: 25%;
			height: 100%;
			display: flex;
			align-items: center;
			flex-direction: column;
			justify-content: space-around;
			font-size: 24rpx;
			color: #BFBFBF;
			position: relative;

			.redDot {
				position: absolute;
				top: 0rpx;
				right: 60rpx;
				width: 25rpx;
				height: 25rpx;
				background: #D90000;
				display: flex;
				align-items: center;
				justify-content: center;
				border-radius: 50%;

			}
		}

		.myBackupImg {
			width: 44rpx;
			height: 44rpx;
		}

		.buy {
			width: 50%;
			font-size: 36rpx;
			color: #FFFFFF;
			display: flex;
			align-items: center;
			justify-content: center;
			background: #6337CC;

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

	.houseImg {
		width: 100%;
		height: calc(100vh - 510rpx)
	}
</style>
