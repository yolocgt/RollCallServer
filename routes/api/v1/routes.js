// express
const exp = require('express');
// router
const router = exp.Router();

// 数据库db
const db = require('../../../db');



// 设置路由
const setRoute = require('./common').setRoute;

// var AdminDal = db.AdminDal();
// AdminDal = new AdminDal();
var AdminDal = new (db.AdminDal)();
setRoute(router, AdminDal, 'admin')

var CourseDal = new (db.CourseDal)();
// CourseDal = new CourseDal();
setRoute(router, CourseDal, 'course');














module.exports = router;
