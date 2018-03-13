/**
 * @description 
 * @author CGT
 * @param {Function} router 路由
 * @param {Object} dal 数据访问层
 * @param {String} moduleName 模块名
 */
function setRoute(router, dal, moduleName) {

	// 根据班级id查询学生数量：
	if (moduleName == "student") {
		router.post(`/${moduleName}/count`, (req, res) => {
			var classid = req.body.classid;
			var filter = { "classInfo": classid };
			console.log(filter);
			dal.getData(filter, (data) => {
				console.log('根据班级id查询学生数量：');
				console.log(data);
				res.json({ status: 'y', msg: '查询数量成功~', data: data })

			})
		})
	}
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
		dal.delById(id, function (isOK) {
			if (isOK) {
				res.json({ status: 'y', msg: '删除成功~' })
			} else {
				res.json({ status: 'n', msg: '删除失败。' })
			}
		})
	})

	// 删除多条数据
	router.delete(`/${moduleName}s/:id`, (req, res) => {
		var id = req.params.id;
		console.log(moduleName);
		console.log('删除多条考勤数据');
		console.log(id);
		if (id) {
			var filter = {
				rollcall: id
			}
			dal.delMany(filter, function (isOK) {
				if (isOK) {
					res.json({ status: 'y', msg: '删除成功~' })
				} else {
					res.json({ status: 'n', msg: '删除失败。' })
				}
			})
		} else console.log('未指定删除条件 id');
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
			console.log('findByID............');
			// console.log(data);
			res.json({ status: 'y', msg: '查找成功~', data: data })
		})
	})

	// 获取所有的数据 / 根据条件获取数据
	router.post(`/all_${moduleName}`, (req, res) => {
		console.log('模块名 ' + moduleName);
		console.log('模糊查询体：');
		console.log(req.body);
		// 
		var filter = {};

		var className = req.body.className
		if (className) {
			console.log('我是谁？我在哪？');
			filter.className = { '$regex': `.*?${className}.*?` };
		}

		// 2.班级信息编辑 院系下拉框级联辅导员信息
		var faculty = req.body.faculty;
		if (faculty) {
			filter.faculty = faculty;
		}

		// 删除辅导员，查询是否在班级表中使用
		var counselor = req.body.counselor;
		if (counselor) {
			filter.counselor = counselor;
		}
		// 删除教师，查询是否在排课表中使用
		var teacher = req.body.teacher;
		if (teacher) {
			filter.teacher = teacher;
		}
		// 删除课程，查询是否在排课表中使用
		var course = req.body.course;
		if (course) {
			filter.course = course;
		}
		// 删除专业，查询是否在班级表中使用
		var major = req.body.major;
		if (major) {
			filter.major = major;
		}
		// 删除班级，查询是否在学生表和排课表中使用
		var classInfo = req.body.classInfo;
		if (classInfo) {
			filter.classInfo = classInfo;
		}
		// 删除学生，查询是否在考勤表中使用
		var student = req.body.student;
		if (student) {
			filter.student = student;
		}
		// 删除排课，查询是否在点名表中使用
		var arrange = req.body.arrange;
		if (arrange) {
			filter.arrange = arrange;
		}
		
		console.log('*************');
		console.log(filter);

		dal.getData(filter, (data) => {
			// console.log('all............');
			// console.log(data);
			res.json({ status: 'y', msg: '获取数据成功', data: data })
		})
	})

	// 获取分页数据  bug?
	router.post(`/${moduleName}s`, (req, res) => {
		var page = 1;//
		console.log(`模块名【${moduleName}】`);
		console.log('查询条件：》》》');
		console.log(req.body);
		if (req.body.page) { page = Number(req.body.page); }

		// ******************* 查询条件 *******************
		var filter = {};
		var word = req.body.word;
		var word2 = req.body.word2;
		var word3 = req.body.word3;
		// 1.模糊查询管理员 考勤记录
		// 排课表
		if (moduleName == "arrange") {
			if (word) {
				filter.learnYear = word;
			}
			if (word2) {
				filter.learnTerm = word2;
			}
			if (word3) {
				filter.classInfo = {};
				filter.classInfo.$in = word3;
			}
			console.log('arrange>>>>>>>>>>>>>>>>>>>');
			console.log(filter);
		} else if (moduleName == "student" || moduleName == "teacher" || moduleName == "admin" || moduleName == "counselor" || moduleName == "rollcall") {
			if (word) {
				filter.$or = [
					{ id: { '$regex': `.*?${word}.*?` } },
					{ name: { '$regex': `.*?${word}.*?` } },
					{ rollcall: word }
				];
			}
			console.log(filter.$or);
		}
		console.log("查询条件：" + filter);
		dal.getDataByPage(page, filter, (data) => {
			// console.log(data);
			res.json({ status: 'y', msg: '获取分页数据成功', data: data })
		})
	})


	// return router;
}

// module.exports = { setRoute };/**
//  * @description 
//  * @author CGT
//  * @param {Function} router 路由
//  * @param {Object} dal 数据访问层
//  * @param {String} moduleName 模块名
//  */
// function setRoute(router, dal, moduleName) {

// 	// 根据班级id查询学生数量：
// 	if (moduleName == "student") {
// 		router.post(`/${moduleName}/count`, (req, res) => {
// 			var classid = req.body.classid;
// 			var filter = { "classInfo": classid };
// 			console.log(filter);
// 			dal.getData(filter, (data) => {
// 				console.log('根据班级id查询学生数量：');
// 				console.log(data);
// 				res.json({ status: 'y', msg: '查询数量成功~', data: data })

// 			})
// 		})
// 	}
// 	// 学生、教师、管理员、辅导员的登录接口
// 	if (moduleName == "student" || moduleName == "teacher" || moduleName == "counselor" || moduleName == "admin") {
// 		// 根据用户名查找一条数据，并比较密码
// 		router.post(`/${moduleName}/login`, (req, res) => {
// 			var id = req.body.username;
// 			var psw = req.body.password;
// 			var filter = { "id": id };
// 			dal.getData(filter, (data) => {
// 				var user = data[0];
// 				console.log(user);
// 				// 查找到数据
// 				if (user) {
// 					// 密码匹配
// 					if (psw == user.password) {
// 						// console.log('成功');
// 						res.json({ status: 'y', msg: '登录成功', name: user.name })
// 					} else {
// 						// console.log('失败');
// 						res.json({ status: 'password error', msg: '密码有误' })
// 					}
// 				} else {//查找不到数据
// 					res.json({ status: 'user is not exists', msg: '用户不存在' })
// 				}
// 			})
// 		})
// 		// 根据账号查找一条数据，判断是否存在
// 		router.get(`/${moduleName}/exists/:id`, (req, res) => {
// 			var id = req.params.id;
// 			var filter = { "id": id };
// 			console.log('查找的账号为：' + id);
// 			dal.getData(filter, (data) => {
// 				console.log(data);
// 				res.json({ status: "y", data: data })
// 			})
// 		})
// 	} else {
// 		// 根据实体名判断一个实体是否存在，判断是否存在
// 		router.get(`/${moduleName}/exists/:name`, (req, res) => {
// 			var fieldName = moduleName + "Name";
// 			if (moduleName == "classInfo") fieldName = "className";
// 			var filter = {};
// 			filter[fieldName] = req.params.name;
// 			// console.log(filter);
// 			dal.getData(filter, (data) => {
// 				console.log(data);
// 				res.json({ status: 'y', data: data })
// 			})


// 		})
// 	}

// 	// 添加一条数据
// 	router.post(`/${moduleName}`, (req, res) => {
// 		// console.log(req.body);
// 		dal.save(req.body, (isOK) => {
// 			if (isOK) {
// 				res.json({ status: 'y', msg: '新增成功~' })
// 			} else {
// 				res.json({ status: 'n', msg: '新增失败！' })
// 			}
// 		})
// 	})
// 	// 删除一条数据
// 	router.delete(`/${moduleName}/:id`, (req, res) => {
// 		var id = req.params.id;
// 		dal.delById(id, function (isOK) {
// 			if (isOK) {
// 				res.json({ status: 'y', msg: '删除成功~' })
// 			} else {
// 				res.json({ status: 'n', msg: '删除失败。' })
// 			}
// 		})
// 	})

// 	// 删除多条数据
// 	router.delete(`/${moduleName}s/:id`, (req, res) => {
// 		var id = req.params.id;
// 		console.log(moduleName);
// 		console.log('删除多条考勤数据');
// 		console.log(id);
// 		if (id) {
// 			var filter = {
// 				rollcall: id
// 			}
// 			dal.delMany(filter, function (isOK) {
// 				if (isOK) {
// 					res.json({ status: 'y', msg: '删除成功~' })
// 				} else {
// 					res.json({ status: 'n', msg: '删除失败。' })
// 				}
// 			})
// 		} else console.log('未指定删除条件 id');
// 	})

// 	// 修改一条数据
// 	router.put(`/${moduleName}/:id`, (req, res) => {
// 		var id = req.params.id;
// 		dal.updateByID(id, req.body, (isOK) => {
// 			if (isOK) {
// 				res.json({ status: 'y', msg: '更新成功~' })
// 			} else {
// 				res.json({ status: 'n', msg: '更新失败!' })
// 			}
// 		})
// 	})
// 	// 获取一条数据
// 	router.get(`/${moduleName}/:id`, (req, res) => {
// 		var id = req.params.id;
// 		dal.findByID(id, function (data) {
// 			console.log('findByID............');
// 			// console.log(data);
// 			res.json({ status: 'y', msg: '查找成功~', data: data })
// 		})
// 	})



// 	// 获取分页数据  bug?
// 	router.post(`/${moduleName}s`, (req, res) => {
// 		var page = 1;//
// 		console.log(`模块名【${moduleName}】`);
// 		console.log('查询条件：》》》');
// 		console.log(req.body);
// 		if (req.body.page) { page = Number(req.body.page); }

// 		// ******************* 查询条件 *******************
// 		var filter = {};
// 		var word = req.body.word;
// 		// console.log('word::::');
// 		// console.log(word);
// 		var word2 = req.body.word2;
// 		var word3 = req.body.word3;
// 		// 1.模糊查询管理员 考勤记录
// 		// 排课表
// 		if (moduleName == "arrange") {
// 			if (word) {
// 				filter.learnYear = word;
// 			}
// 			if (word2) {
// 				filter.learnTerm = word2;
// 			}
// 			if (word3) {
// 				filter.classInfo = {};
// 				filter.classInfo.$in = word3;
// 			}
// 			console.log('arrange>>>>>>>>>>>>>>>>>>>');
// 			console.log(filter);
// 		} else if (moduleName == "student" || moduleName == "teacher" || moduleName == "admin" || moduleName == "counselor" || moduleName == "rollcall") {
// 			if (word) {
// 				filter.$or = [
// 					{ id: { '$regex': `.*?${word}.*?` } },
// 					{ name: { '$regex': `.*?${word}.*?` } },
// 					{ rollcall: word }
// 				];
// 			}
// 			console.log(filter.$or);
// 		}
// 		console.log("查询条件：" + filter);
// 		dal.getDataByPage(page, filter, (data) => {
// 			// console.log(data);
// 			res.json({ status: 'y', msg: '获取分页数据成功', data: data })
// 		})
// 	})


// 	// return router;
// }

module.exports = { setRoute };