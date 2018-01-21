// express
const exp = require('express');
// router
const router = exp.Router();

// 数据库db
const db = require('../../../db');

// 批量设置路由
const setRoute = require('./common').setRoute;
for (const key in db) {
	var dal = new (db[key])()
	setRoute(router, dal, dal.mName);
}

module.exports = router;
