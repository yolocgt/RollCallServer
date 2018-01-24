const exp = require('express');
const router = exp.Router();
const db = require('../../../db');
// const crypto = require('crypto');
const bodyParser = require('body-parser');

// 用户登录
router.post('/login', (req, res) => {
	db.Admin
		.findOne({ account: req.body.account })
		.then((user) => {
			var password = req.body.password;
			// password = crypto.createHash('md5').update(password).digest('hex').toString();
			if (password == user.password) {
				res.send('登录成功');
			} else {
				res.send('密码有误');
			}
		}).catch(() => {
			res.send('用户不存在,请重新登录');
		})
})
// 是否存在
router.post('/exists', (req, res) => {
	db.Admin
		.findOne({ account: req.body })
		.then((user) => {
			var password = req.body.password;
			// password = crypto.createHash('md5').update(password).digest('hex').toString();
			if (password == user.password) {
				res.send('登录成功');
			} else {
				res.send('密码有误');
			}
		}).catch(() => {
			res.send('用户不存在,请重新登录');
		})
})

module.exports = router;