<script>
	export default {
		onLaunch: function() {
			console.log(
				"%c" + [
					"                   _ooOoo_",
					"                  o8888888o",
					'                  88" . "88',
					"                  (| -_- |)",
					"                  O\\  =  /O",
					"               ____/`---'\\____",
					"             .'  \\\\|     |//  `.",
					"            /  \\\\|||  :  |||//  \\",
					"           /  _||||| -:- |||||-  \\",
					"           |   | \\\\\\  -  /// |   |",
					"           | \\_|  ''\\---/''  |   |",
					"           \\  .-\\__  `-`  ___/-. /",
					"         ___`. .'  /--.--\\  `. . __",
					'      ."" \'<  `.___\\_<|>_/___.\'  >\'"".',
					"     | | :  `- \\`.;`\\ _ /`;.`/ - ` : | |",
					"     \\  \\ `-.   \\_ __\\ /__ _/   .-` /  /",
					"======`-.____`-.___\\_____/___.-`____.-'======",
					"                   `=---='",
					"^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^",
					"         佛祖保佑       永无BUG",
				].join("\n"),
				"color:yellow"
			);
		},
		globalData: {
			userInfo: '',
			socket: null
		},
		onShow: function() {
			// this.checkUpdateVersion()
			console.log('App Show');
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
	}
</script>

<style>
	.container {
		font-family: PingFangSC-Regular, PingFang SC;
	}
</style>
