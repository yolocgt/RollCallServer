function luyou(adminDal, module) {
	const exp = require('express');
	const router = exp.Router();
	// 添加管理员
	router.post(`/${module}`, (req, res) => {
		adminDal.save(req.body, (isOK) => {
			if (isOK) {
				res.json({ status: 'y', msg: '新增成功~' })
			} else {
				res.json({ status: 'n', msg: '新增失败！' })
			}
		})
	})
	// 删除管理员
	router.delete(`/${module}:id`, (req, res) => {
		var id = req.params.id;
		adminDal.del(id, function (isOK) {
			if (isOK) {
				res.json({ status: 'y', msg: '删除成功~' })
			} else {
				res.json({ status: 'n', msg: '删除失败。' })
			}
		})
	})
	// 获取一个管理员
	router.get(`/${module}:id`, (req, res) => {
		var id = req.params.id;
		adminDal.findByID(id, function (data) {
			// console.log(data);
			res.json({ status: 'y', msg: '查找成功~', data: data })
		})
	})
	// 获取分页管理员数据
	router.get(`/${module}s`, (req, res) => {
		//分页页码
		var page = 1;
		if (req.query.page) {
			page = Number(req.query.page);
		}

		var filter = {};
		// 查询条件
		var word = req.query.word;
		if (word) {
			filter.$or = [
				{ account: { '$regex': `.*?${word}.*?` } },
				{ name: { '$regex': `.*?${word}.*?` } }
			];
			// console.log(filter.$or);
		}
		// console.log("查询条件：");
		// console.log(filter);
		adminDal.getDataByPage(page, filter, (data) => {
			res.json({ status: 'y', msg: '获取分页数据成功', data: data })
		})
	})

	// 获取所有的管理员数据
	router.get(`/all_${module}`, (req, res) => {
		adminDal.getData({}, (data) => {
			res.json({ status: 'y', msg: '获取分页数据成功', data: data })
		})
	})
	// 修改管理员
	router.put(`/${module}:id`, (req, res) => {
		var id = req.params.id;
		adminDal.updateByID(id, req.body, (isOK) => {
			if (isOK) {
				res.json({ status: 'y', msg: '更新成功~' })
			} else {
				res.json({ status: 'n', msg: '更新失败!' })
			}
		})

	})
	return router;
}

module.exports = {luyou};