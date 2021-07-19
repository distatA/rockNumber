// 封装axios请求
// 用一个函数封装并内部返回一个promise对象

// 基地址
//flag是否使用线上路径 
 let flag = true 
 let baseUrl
flag ?  baseUrl = 'https://58hongren.com/dyf-open' :  baseUrl = 'http://192.168.110.185:8081/dyf-open' 
let goNum = 0 //跳转判断次数 ,由于有的页面会一下子同事请求几个接口,如果没有token会同时报错,并且同时触发跳转
// https://58hongren.com/dyf-open
// http://192.168.110.185:8081
// 计数器 
const axios = (params) => {
	// params.header = {
	// 	'content-type': 'application/json'
	// }
	const {
		token,
		projectNo
	} = wx.getStorageSync('userInfo') || ''
	if (!token) {
		// 否则跳转去授权

	} else {
		params.header = {
			token: token
		}
	}
	return new Promise((resolve, reject) => {
		uni.request({
			// 解构出调用axios时传进来的数据 
			...params,
			// 把传进来的url覆盖了
			// 优化
			url: baseUrl + params.url,
			// 成功调用resolve
			success: (result) => {
				resolve(result.data);
				if (result.data.code === 10000 && goNum === 0) {
					wx.navigateTo({
						url: `/pages/login/login?projectNo=${projectNo}`
					})
					uni.showToast({
						title: '未登录',
						icon: 'none'
					})
					goNum = 1
					setTimeout(() => {
						goNum = 0
					}, 2000)
				}
			},
			// 失败调用reject
			fial: (error) => {
				// 提示 
				uni.showToast({
					title: '数据获取失败',
					icon: 'none',
				});
				reject(error);
			},
		});
	});
};

// 暴露axios对象出去
export default axios
