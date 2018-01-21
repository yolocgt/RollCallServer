// express
const exp = require('express');
// router
const router = exp.Router();

// 数据库db
const db = require('../../../db');

// 批量设置路由
const setRoute = require('./common').setRoute;
for (const key in db) {
	// 判断是否为Dal数据模型
	if (key.indexOf('Dal') != -1) {
		// console.log(key);
		var dal = new (db[key])();
		setRoute(router, dal, dal.mName);
	}
}

// console.log(router.stack);

// console.log('\n》》》》》》》》》》》》已创建路由》》》》》》');
// var i = 0;
// for (const key in router.stack) {
// 	const r = router.stack[key].route
// 	console.log(r.path);
// 	if (i < 6) {
// 		console.log(r.methods);
// 	}
// 	i++;
// 	if (i % 6 == 0) {
// 		console.log('\n');
// 	}
// }
// console.log('》》》》》》》》》》》》已创建【' + router.stack.length +'】个路由。》》》》》》');

module.exports = router;