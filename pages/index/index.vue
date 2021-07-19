<template>
	<view class="container" >
		<!-- 倒计时 -->
		<countDownTime :data='time' isShow="true" @getChild="changeStatus" />
		<!-- 筛选 -->
		<view class="changeTab">
			<view class="ridgepole" @click="handleFilter(0)">
				<text>{{currentRidgepoleName}}栋</text>
				<image src="../../static/icon/downFoucs.png" class="dropDwon" mode=""></image>
			</view>
			<view class="element" @click="handleFilter(1)">
				<text>{{currentElementName}}单元</text>
				<image src="../../static/icon/downFoucs.png" class="dropDwon" mode=""></image>
			</view>
			<view class="floor" @click="handleFilter(2)">
				<text>{{currentFloorName !== -100 ? currentFloorName :''}}楼层</text>
				<image src="../../static/icon/downFoucs.png" class="dropDwon" mode=""></image>
			</view>
			<!-- 栋的筛选框 -->
			<view class="filterBox" v-if="isShowFilter">
				<view class="house_ridgepoleBox" v-if="showFilter == 0 && selectArr.buildNos ">
					<text class="house_ridgepoleBox_item" v-for="(item,index) in selectArr.buildNos" :key="index" :style="currentRidgepole === index ? 'color:#fff;background:#6337CC' : ''"
					 @click="handleRidgepole(item,index)">{{item}}栋</text>
				</view>
				<view class="house_elementBox" v-if="showFilter == 1 && selectArr.units">
					<text class="house_elementBox_item" v-for="(item,index) in selectArr.units" :key="index" :style="currentElement === index ? 'color:#fff;background:#6337CC' : ''"
					 @click="handleElement(item,index)">{{item}}单元</text>
				</view>
				<view class="house_floorBox" v-if="showFilter == 2 && selectArr.floorNos">
					<text class="house_floorBox_item" v-for="(item,index) in selectArr.floorNos" :key="index" :style="currentFloor === index ? 'color:#fff;background:#6337CC' : ''"
					 @click="handleFloor(item,index)">{{item}}{{item == '全部' ? '' : '层'}}</text>
				</view>
				<view class="bottomBar">
					<view class="reset" @click="reset">
						重置
					</view>
					<view class="confirm" @click="search">
						确认
					</view>
				</view>
			</view>
		</view>
		<view class="contentBox" v-for="(item,index) in list" :key="index">
			<view class="floorTitle" v-if="isShowFloor">
				<image src="../../static/icon/floor.png" class="floorImg" mode=""></image>
				<view class="floorName">{{item.floorNo}}层</view>
			</view>
			<view class="content">
				<view class="house_item" v-for="(items,indexs) in item.list" :key="indexs" v-if="item.list.length !== 0" @click="toDetail(items)"
				 data-detail="item">
					<!-- 	houseNum 没人选的   my 我选的  other 别人选的 -->
					<view class="houseNum" v-if="items.isChoose != 1 &&  items.myChoose != 1">
						{{items.houseNo}}
					</view>
					<view :class="{my : items.isChoose == 1 && items.myChoose == 1}" v-if=" items.isChoose == 1 && items.myChoose == 1">
						{{items.houseNo}}
					</view>
					<view :class="{other : items.isChoose == 1 && items.myChoose != 1 }" v-if=" items.isChoose == 1 && items.myChoose != 1">
						{{items.houseNo}}
					</view>
					<view class="houseInfo">
						<text>{{Math.round((items.originalAllPrice /10000) * 100) / 100}}万</text>
						<text>{{items.doorModelNo}}户型</text>
					</view>
				</view>
			</view>
		</view>
		<empty v-if="list.length === 0" />
	</view>
</template>

<script>
	//倒计时 空提示 
	import countDownTime from '../../componetnt/countDownTime'
	import empty from '../../componetnt/empty'
	const App = getApp()
	export default {
		data() {
			return {
				time: '',
				showFilter: '', //展示的筛选框
				isShowFilter: false,
				userInfo: '',
				currentRidgepole: 0, //栋判断索引
				currentElement: 0, //单元判断索引
				currentFloor: 0, //楼判断索引
				currentRidgepoleName: 1, //栋名字
				currentElementName: 1, //单元名字
				currentFloorName: '全部', //楼名字
				isChoose: 0, //是否只看未选
				selectArr: '', //筛选的数组
				list: [], //渲染的数组
				timer: '', //倒计时
				isShowFloor: true
			}
		},
		components: {
			countDownTime,
			empty
		},
		onLoad(options) {
			this.userInfo = uni.getStorageSync('userInfo') || ''
		},
		onShow() {
			this.userInfo = uni.getStorageSync('userInfo') || ''
			uni.setNavigationBarTitle({
				title: this.userInfo.projectName
			})
			this.getList()
			this.computeTime()
			this.checkUpdateVersion()
		},
		methods: {
			// 修改只看未选的状态 
			changeStatus(e) {
				e === true ? this.isChoose = 1 : this.isChoose = 0;
				this.search()
			},
			//选择打开哪个筛选框
			handleFilter(e) {
				this.isShowFilter = true
				if (e === this.showFilter) {
					this.isShowFilter = false
					this.showFilter = ''
				} else {
					this.showFilter = e
				}
			},
			// 选择哪一单元  
			handleElement(v, e) {
				this.currentElementName = v
				this.currentElement = e
			},
			// 选择哪一栋
			handleRidgepole(v, e) {
				this.currentRidgepoleName = v
				this.currentRidgepole = e
			},
			// 选择哪一个楼层
			handleFloor(v, e) {
				// console.log(v);
				this.currentFloorName = v
				this.currentFloor = e

			},
			// 获取列表信息
			getList() {
				// if (this.userInfo.projectNo) {
					this.$http({
						url: '/openHouse/paramsList',
						method: 'GET',
						data: {
							projectNo: !this.userInfo.projectNo ? '' : this.userInfo.projectNo
						}
					}).then(res => {
						if (res.code === 0) {
							this.selectArr = res.map
							this.selectArr.floorNos.unshift('全部')
							this.currentRidgepoleName = this.selectArr.buildNos ? this.selectArr.buildNos[0] : 1
							this.currentElementName = this.selectArr.units ? this.selectArr.units[0] : 1
							console.log(this.currentRidgepoleName, this.currentElementName);
							// this.currentFloorName = this.selectArr.floorNos ? this.selectArr.floorNos[0] : 1
							this.search()
						} else {
							uni.showToast({
								title: res.msg,
								icon: 'none'
							})
						}
					})
				// }
			},
			// 筛选搜索
			search() {
				if (this.currentRidgepoleName && this.currentElementName) {
					this.$http({
						url: '/openHouse/searchList',
						method: 'GET',
						data: {
							projectNo: this.userInfo.projectNo,
							buildNo: this.currentRidgepoleName,
							unitNo: this.currentElementName,
							floorNo: this.currentFloorName == '全部' ? -100 : this.currentFloorName,
							isChoose: this.isChoose,
							userId: this.userInfo.userNo
						}
					}).then(res => {
						if (res.code === 0) {
							this.currentFloorName != '全部' ? this.isShowFloor = false : this.isShowFloor = true
							this.list = res.list
							// console.log(this.list);
							this.isShowFilter = false
							this.showFilter = ''
						} else {
							uni.showToast({
								title: res.msg,
								icon: 'none'
							})
						}
					})
				} else {
					console.log('楼层数据不全');
				}
			},
			// 重置
			reset() {
				switch (this.showFilter) {
					case 0:
						this.currentRidgepole = 0 //栋判断索引
						this.currentRidgepoleName = this.selectArr.buildNos[0]
						break;
					case 1:
						this.currentElement = 0 //单元判断索引
						this.currentElementName = this.selectArr.units[0]
						break;
					case 2:
						this.currentFloor = 0 //楼判断索引
						this.currentFloorName = '全部'
						break;
				}
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
			// 跳转详情
			toDetail(e) {
				// console.log(e);
				uni.navigateTo({
					url: `/pages/myBackupDetail/myBackupDetail?roomNo=${e.roomNo}`
				})
			},
			// 获取项目最新信息 
			getProjectMsg(projectNO) {
				this.$http({
					url: '/openUser/getScene',
					method: 'GET',
					data: {
						projectNO
					}
				}).then(res => {
					if (res.code === 0) {
						let userInfo = uni.getStorageSync('userInfo') || ''
						let {
							projectEndTime,
							projectName,
							projectNo,
							projectOpenTime
						} = res.data
						userInfo.projectEndTime = projectEndTime
						userInfo.projectName = projectName
						userInfo.projectNo = projectNo
						userInfo.projectOpenTime = projectOpenTime
						uni.setStorageSync('userInfo', userInfo);
						this.userInfo = userInfo
						if (this.timer) {
							clearInterval(this.timer);
							this.time = ''
						}
						this.computeTime()
					} else {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
					}
				})
			},
			checkUpdateVersion() {
				const updateManager = uni.getUpdateManager();
				updateManager.onCheckForUpdate(function(res) {
					// 请求完新版本信息的回调
				});
					updateManager.onUpdateReady(function(res) {
						uni.showModal({
							title: '更新提示',
							content: '新版本已经准备好，是否重启应用？',
							success(res) {
								if (res.confirm) {
									// 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
									updateManager.applyUpdate();
								}
							}
						});
					});
					updateManager.onUpdateFailed(function(res) {
						// 新的版本下载失败
					});
			}
		},

		onHide() {
			this.currentRidgepoleName = this.selectArr.buildNos ? this.selectArr.buildNos[0] : 1
			this.currentElementName = this.selectArr.units ? this.selectArr.units[0] : 1
			this.currentFloorName = '全部'
			this.currentRidgepole = 0
			this.currentElement = 0
			this.currentFloor = 0
			clearInterval(this.timer)
			this.time = ''
		},
	}
</script>

<style scoped lang="less">
	.my {
		color: #fff;
		background-color: #6337CC;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 28rpx;
		height: 44rpx;
		width: 100%;
	}

	.other {
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 28rpx;
		height: 44rpx;
		width: 100%;
		color: #fff;
		background-color: #717171;
	}

	.changeTab {
		position: relative;
		width: 100%;
		height: 80rpx;
		background: rgba(255, 255, 255, 0.99);
		display: flex;
		align-items: center;
		justify-content: space-around;
		border-bottom: 2rpx solid #e4e4e4;
		font-size: 32rpx;
		color: #6337CC;

		.dropDwon {
			margin-top: 7rpx;
			width: 28rpx;
			height: 25rpx;
			margin-left: 10rpx;
		}

		.ridgepole,
		.element,
		.floor {
			align-items: center;
			display: flex;
		}
	}

	.filterBox {
		position: absolute;
		top: 80rpx;
		left: 0;
		min-height: 100rpx;
		width: 100%;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		z-index: 5;
		background: #FFFFFF;
		box-shadow: 0px -4px 8px 0px rgba(196, 196, 196, 0.5);

		.house_ridgepoleBox,
		.house_floorBox {
			padding: 0 40rpx;
			justify-content: space-around;
			display: grid;
			grid-template-columns: repeat(auto-fill, 80rpx);
			grid-column-gap: 20rpx;

			.house_ridgepoleBox_item {
				margin: 15rpx 0;
				background-color: #dddddd;
				display: flex;
				align-items: center;
				justify-content: center;
				width: 80rpx;
				height: 60rpx;
				color: #717171;
				border-radius: 6rpx;
			}

			.house_floorBox_item {
				margin: 15rpx 0;
				background-color: #dddddd;
				display: flex;
				align-items: center;
				justify-content: center;
				width: 80rpx;
				height: 60rpx;
				color: #717171;
				border-radius: 6rpx;
			}
		}

		.house_elementBox {
			padding: 0 40rpx;
			justify-content: space-around;
			display: grid;
			grid-template-columns: repeat(auto-fill, 180rpx);
			grid-column-gap: 20rpx;

			.house_elementBox_item {
				border-radius: 6rpx;
				margin: 15rpx 0;
				background-color: #dddddd;
				display: flex;
				align-items: center;
				justify-content: center;
				width: 180rpx;
				height: 60rpx;
				color: #717171;
			}
		}



		.bottomBar {
			height: 60rpx;
			width: 100%;
			margin: 32rpx 0 40rpx 0;
			display: flex;
			align-items: center;
			justify-content: space-around;

			.reset {
				width: 200rpx;
				height: 100%;
				font-size: 28rpx;
				border-radius: 6rpx;
				color: #717171;
				display: flex;
				align-items: center;
				justify-content: center;
				border: 2px solid #F1F1F1;
			}

			.confirm {
				border-radius: 6rpx;
				width: 200rpx;
				height: 100%;
				font-size: 28rpx;
				color: #FFFFFF;
				background: #6337CC;
				display: flex;
				align-items: center;
				justify-content: center;
			}
		}
	}

	// .content::after {
	// 	content: "";
	// 	width: 140rpx;
	// }
	// .house_item:nth-last-child(2){
	// 	opacity: 0;
	// }
	// .house_item:last-child{
	// 	opacity: 0;
	// }
	.content {
		padding: 10rpx 30rpx;
		display: flex;
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(140rpx, auto);
		);
		grid-column-gap: minmax(auto, 20rpx);
		grid-auto-flow: row dense;
		justify-content: space-between;
		grid-row-gap: 35rpx;

		// box-sizing: border-box;
		// display: flex;
		// flex-wrap: wrap;
		.house_item {
			// margin-right: 36rpx;
			background-color: #F9F9F9;
			display: flex;
			flex-direction: column;
			align-items: center;
			// width: 140rpx;
			height: 120rpx;
			font-size: 24rpx;
			color: #AAAAAA;
			// margin-bottom: 35rpx;
			overflow: hidden; //超出的文本隐藏
			text-overflow: ellipsis; //溢出用省略号显示
			white-space: nowrap; //溢出不换行
			border-radius: 5rpx;
			border: #D1D1D1 1rpx solid;

			.houseNum {
				display: flex;
				align-items: center;
				justify-content: center;
				font-size: 28rpx;
				color: #000000;
				height: 44rpx;
				width: 100%;
			}

			.houseInfo {
				display: flex;
				flex-direction: column;
				align-items: center;
			}
		}


	}

	.floorTitle {
		width: 100%;
		height: 60rpx;
		display: flex;
		height: 40rpx;
		font-size: 28rpx;
		color: #717171;
		padding-left: 40rpx;
		margin-top: 16rpx;

		.floorImg {
			width: 34rpx;
			height: 28rpx;

		}

		.floorName {}
	}

	.contentBox {
		display: flex;
		flex-direction: column;
	}
</style>
