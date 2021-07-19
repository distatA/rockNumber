<template>
	<view class="container">
		<view class="title">
			欢迎登录
		</view>
		<view class="titleTwo">
			第一房线上开盘系统
		</view>

		<view class="content">
			<view class="userPhone">
				<view class="userPhoneName">
					手机号
				</view>
				<input type="text" class="input" value="" @input="input" placeholder="填写预留手机号码" />
			</view>
			<view class="password">
				<view class="userPhoneName">
					验证码
				</view>
				<input value="" type="number" class="input" @input="password" placeholder="请输入验证码" />
				<view class="code" @click="sendMsg">
					{{codeText}}
				</view>
				<view class="code" v-if="disabled">
					{{codeText}}
				</view>
			</view>
		</view>
		<view class="btn" @click="login">
			登录
		</view>
	</view>
</template>

<script>
	const App = getApp()
	import axios from '../../util/request.js'
	export default {
		data() {
			return {
				data: 123,
				inputValue: '', //输入框的值
				pswValue: '', //密码框的值
				disabled: false, //是否禁用
				codeText: '获取验证码', //
				currentTime: 0, //
				projectNo: '' //项目编号
			};
		},
		onLoad(options) {
			if (options.scene != '' && options.scene != undefined) {
				options.scene ? this.projectNo = options.scene : ''
				console.log(this.projectNo);
			}
		},
		methods: {
			// this.login()
			// 判断是否有这个手机号码
			judgePhone() {
				this.$http({
					url: '/openUser/checkPhoneIsExist',
					mtthod: 'GET',
					data: {
						tel: this.inputValue
					}
				}).then(res => {
					if (res.code === 0) {
						this.getCode()
					} else {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
					}
				})
			},
			input(e) {
				this.inputValue = e.detail.value
			},
			password(e) {
				this.pswValue = e.detail.value
			},
			// 发送验证码 
			sendMsg() {
				let v = this.inputValue
				if (v.trim() === '' || !(/^1[3456789]\d{9}$/.test(v))) {
					uni.showToast({
						title: '请正确填写手机号',
						icon: 'none'
					});
					this.inputValue = ''

				} else {
					this.judgePhone()
				}
			},
			// 验证码定时器 
			waitCode() {
				var interval
				var currentTime = 60
				interval = setInterval(() => {
					currentTime--;
					this.codeText = currentTime + '秒后重新发送';
					if (currentTime <= 0) {
						clearInterval(interval)
						this.codeText = '获取验证码';
						this.currentTime = 60;
						this.disabled = false;
					}
				}, 1000)
			},
			// 获取验证码接口 
			getCode() {
				this.$http({
					url: '/openUser/mobileVerifiCode',
					method: 'GET',
					data: {
						mobile: this.inputValue
					}
				}).then(res => {
					if (res.code === 0) {
						this.waitCode();
						this.disabled = true
					} else {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
					}
				})
			},
			// 登陆
			login() {
				this.projectNo != 'undefined' ? this.projectNo : this.projectNo = ''
				if (!this.inputValue, !this.pswValue) {
					uni.showToast({
						title: '手机号与验证码填写不正确',
						icon: 'none'
					});
				} else {
					this.$http({
						url: '/openUser/login',
						method: 'GET',
						data: {
							mobile: this.inputValue,
							code: this.pswValue,
							projectNo: this.projectNo
						}
					}).then(res => {
						if (res.code === 0) {
							console.log(res);
							uni.setStorageSync('userInfo', res.data);
							App.globalData.userInfo = res.data
							uni.navigateTo({
								url: '/pages/help/help'
							})
						} else {
							uni.showToast({
								title: res.msg,
								icon: 'none'
							})
						}
					})
				}
			},
			checkUpdateVersion() {
				const updateManager = uni.getUpdateManager();
				updateManager.onCheckForUpdate(function(res) {
					// 请求完新版本信息的回调
					console.log(res.hasUpdate);
				});
					updateManager.onUpdateReady(function(res) {
						uni.showModal({
							title: '更新提示',
							content: '新版本已经准备好，是否重启应用？',
							success(res) {
								console.log(res);
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
	}
</script>

<style lang="less" scoped>
	.container {
		.title {

			margin: 50rpx 0rpx 0rpx 86rpx;
			font-size: 52rpx;
			font-weight: 500;
		}

		.titleTwo {
			margin: 16rpx 0rpx 0rpx 86rpx;
			font-size: 52rpx;
			font-weight: 500;
		}

		.content {
			margin-top: 250rpx;
			padding: 0 40rpx;

			.userPhone {
				display: flex;
				align-items: center;
				width: 100%;
				height: 116rpx;
				border-bottom: 2rpx solid #EAEAEA;

			}

			.userPhoneName {
				width: 150rpx;
				font-size: 32rpx;
				display: flex;
				align-items: center;
				justify-content: center;
			}

			.input {
				flex: 1;
				height: 100%;
			}

			.password {
				border-bottom: 2rpx solid #EAEAEA;
				display: flex;
				align-items: center;
				width: 100%;
				height: 116rpx;
			}

			.code {
				box-sizing: border-box;
				z-index: 99;
				position: absolute;
				right: 40rpx;
				top: auto;
				padding: 0 10rpx;
				// width: 160rpx;
				min-width: 160rpx;
				max-width: 200rpx;
				height: 70rpx;
				border-radius: 10rpx;
				border: 2rpx solid #6337CC;
				font-size: 24rpx;
				color: #6337CC;
				display: flex;
				align-items: center;
				justify-content: center;
			}
		}
	}

	.btn {
		width: 500rpx;
		height: 80rpx;
		background: #6337CC;
		border-radius: 10rpx;
		font-size: 36rpx;
		color: #FFFFFF;
		font-weight: 500;
		margin: 110rpx auto;
		display: flex;
		align-items: center;
		justify-content: center;

	}
</style>
