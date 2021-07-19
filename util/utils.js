function countDown(Time) {
	var nowTime = +new Date(); //当前时间的时间戳
	var inputTime = +new Date(Time); // 传进来时间的时间戳
	var times = (inputTime - nowTime) / 1000; // times为剩余时间（倒计时）秒数
	var d = parseInt(times / 60 / 60 / 24); // 倒计时多少天
	// d = d < 10 ? '0' + d : d; // 三元运算符判断天数是否小于10，小于的话在前边加个0（为了看起来不别扭）
	var h = parseInt(times / 60 / 60 % 24); // 倒计时多少小时
	h = h < 10 ? '0' + h : h;
	var m = parseInt(times / 60 % 60); // 倒计时多少分钟
	m = m < 10 ? '0' + m : m;
	var s = parseInt(times % 60); // 倒计时多少秒
	s = s < 10 ? '0' + s : s;
	if (d <= 0) {
		return h + '时' + m + '分' + s + '秒';
	} else {
		return d + '天' + h + '时' + m + '分' + s + '秒';
	}
}

function myTime(value) {
	let date = new Date(value)
	let year = date.getFullYear()
	let month = date.getMonth() + 1
	month = month > 9 ? month : ('0' + month)
	let day = date.getDate()
	day = day > 9 ? day : ('0' + day)
	let hh = date.getHours()
	hh = hh > 9 ? hh : ('0' + hh)
	let mm = date.getMinutes()
	mm = mm > 9 ? mm : ('0' + mm)
	let ss = date.getSeconds()
	ss = ss > 9 ? ss : ('0' + ss)
	let time = year + '-' + month + '-' + day + ' ' + hh + ':' + mm + ':' + ss
	return time
}

function specialTime(value) {
	let date = new Date(value)
	let year = date.getFullYear()
	let month = date.getMonth() + 1
	month = month > 9 ? month : ('0' + month)
	let day = date.getDate()
	day = day > 9 ? day : ('0' + day)
	let hh = date.getHours()
	hh = hh > 9 ? hh : ('0' + hh)
	let mm = date.getMinutes()
	mm = mm > 9 ? mm : ('0' + mm)
	let ss = date.getSeconds()
	ss = ss > 9 ? ss : ('0' + ss)
	let time = month + '月' + day + '日' + '\xa0\xa0\xa0' + hh + ':' + mm
	return time
}

function returnFloat(value) {
	var xsd = value.toString().split(".");
	if (xsd.length == 1) {
		value = value.toString() + ".00";
		return value;
	}
	if (xsd.length > 1) {
		if (xsd[1].length < 2) {
			value = value.toString() + "0";
		}
		return value;
	}
}
export default {
	countDown,
	myTime,
	specialTime,
	returnFloat
}
