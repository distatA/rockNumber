import Vue from 'vue'
import App from './App'
import axios from './util/request.js'
import utils from './util/utils.js'
Vue.config.productionTip = false

App.mpType = 'app'
Vue.prototype.$http = axios
Vue.prototype.countDown = utils.countDown
Vue.prototype.myTime = utils.myTime
Vue.prototype.specialTime = utils.specialTime
Vue.prototype.returnFloat = utils.returnFloat
const app = new Vue({
	
})
app.$mount()
