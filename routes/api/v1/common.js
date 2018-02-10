/**
 * @description 
 * @author CGT
 * @param {Function} router 路由
 * @param {Object} dal 数据访问层
 * @param {String} moduleName 模块名
 */
function setRoute(router, dal, moduleName) {
	// 学生、教师、管理员、辅导员的登录接口
	if (moduleName == "student" || moduleName == "teacher" || moduleName == "counselor" || moduleName == "admin") {
		// 根据用户名查找一条数据，并比较密码
		router.post(`/${moduleName}/login`, (req, res) => {
			var id = req.body.username;
			var psw = req.body.password;
			var filter = { "id": id };
			dal.getData(filter, (data) => {
				var user = data[0];
				console.log(user);
				// 查找到数据
				if (user) {
					// 密码匹配
					if (psw == user.password) {
						// console.log('成功');
						res.json({ status: 'y', msg: '登录成功', name: user.name })
					} else {
						// console.log('失败');
						res.json({ status: 'password error', msg: '密码有误' })
					}
				} else {//查找不到数据
					res.json({ status: 'user is not exists', msg: '用户不存在' })
				}
			})
		})

		// 根据账号查找一条数据，判断是否存在
		router.get(`/${moduleName}/exists/:id`, (req, res) => {
			var id = req.params.id;
			var filter = { "id": id };
			console.log('查找的账号为：' + id);
			dal.getData(filter, (data) => {
				console.log(data);
				res.json({ status: "y", data: data })
			})
		})
	} else {
		// 根据实体名判断一个实体是否存在，判断是否存在
		router.get(`/${moduleName}/exists/:name`, (req, res) => {
			var fieldName = moduleName + "Name";
			if (moduleName == "classInfo") fieldName = "className";
			var filter = {};
			filter[fieldName] = req.params.name;
			// console.log(filter);
			dal.getData(filter, (data) => {
				console.log(data);
				res.json({ status: 'y', data: data })
			})


		})
	}

	// 添加一条数据
	router.post(`/${moduleName}`, (req, res) => {
		// console.log(req.body);
		dal.save(req.body, (isOK) => {
			if (isOK) {
				res.json({ status: 'y', msg: '新增成功~' })
			} else {
				res.json({ status: 'n', msg: '新增失败！' })
			}
		})
	})
	// 删除一条数据
	router.delete(`/${moduleName}/:id`, (req, res) => {
		var id = req.params.id;
		dal.del(id, function (isOK) {
			if (isOK) {
				res.json({ status: 'y', msg: '删除成功~' })
			} else {
				res.json({ status: 'n', msg: '删除失败。' })
			}
		})
	})
	// 修改一条数据
	router.put(`/${moduleName}/:id`, (req, res) => {
		var id = req.params.id;
		dal.updateByID(id, req.body, (isOK) => {
			if (isOK) {
				res.json({ status: 'y', msg: '更新成功~' })
			} else {
				res.json({ status: 'n', msg: '更新失败!' })
			}
		})
	})
	// 获取一条数据
	router.get(`/${moduleName}/:id`, (req, res) => {
		var id = req.params.id;
		dal.findByID(id, function (data) {
			// console.log(data);
			res.json({ status: 'y', msg: '查找成功~', data: data })
		})
	})

	// 获取所有的数据
	router.get(`/all_${moduleName}`, (req, res) => {
		dal.getData({}, (data) => {
			res.json({ status: 'y', msg: '获取数据成功', data: data })
		})
	})

	// 获取分页数据
	router.get(`/${moduleName}s`, (req, res) => {
		var page = 1;//分页页码
		if (req.query.page) { page = Number(req.query.page); }

		// ******************* 查询条件 *******************
		var filter = {};
		var word = req.query.word;
		// 1.模糊查询管理员
		if (word) {
			filter.$or = [
				{ id: { '$regex': `.*?${word}.*?` } },
				{ name: { '$regex': `.*?${word}.*?` } }
			];
			// console.log(filter.$or);
		}
		// console.log("查询条件：");  console.log(filter);
		dal.getDataByPage(page, filter, (data) => {
			res.json({ status: 'y', msg: '获取分页数据成功', data: data })
		})
	})


	// return router;
}

module.exports = { setRoute };