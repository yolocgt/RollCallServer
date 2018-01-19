var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();
global.pageSize = 6 //分页显示的记录数量

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));






//定义管理后台的可以登录的用户信息
const adminUserData = [
  { userName: 'admin', pwd: "admin" },
  { userName: 'tt', pwd: "tt" },
]
app.post('/admin/login', (req, res) => {
  var userName = req.body.userName
  var userPWD = req.body.userPWD

  //根据用户名查询用户数据
  var user = adminUserData.find(item => {
    return item.userName == userName
  })
  if (user) {
    if (user.pwd == userPWD) {
      res.cookie('adminUserName', userName, { path: '/' }) //设置管理后台中登陆用户的cookie信息
      res.json({
        status: 'y',
        msg: '登录成功'
      })
    }
    else {
      res.json({
        status: 'n',
        msg: '用户密码错误!'
      })
    }
  }
  else {
    res.json({
      status: 'n',
      msg: '用户信息不存在!'
    })
  } 
})
//所有的路由地址中包含/admin的都需要进行登录判断
app.all('/admin/*', (req, res, next) => {
  console.log('当前访问的是管理后台,需要登录')
  console.log(req.cookies)
  //判断用户是否登录
  if (req.cookies.adminUserName) {
    //此处可以继续用户合法性的判断...
    next()
  }
  else {
    res.redirect('/admin/login.html')
  }
  // next()
})


// 允许api控制器部分代码调用的时候可以进行跨域访问
app.all('/api/*', (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "X-Requested-With,Content-Type")
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS")
  res.header("Content-Type", "application/json;charset=utf-8");
  next()
})


app.use('/api/v1/', require('./routes/api/v1/admin'));
app.use('/api/v1/', require('./routes/api/v1/faculty'));
app.listen(1219, () => {
  console.log('服务器运行在1219端口。');
})
