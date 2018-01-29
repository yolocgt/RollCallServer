const db_base = require('./db_base')
const mongoose = db_base.mongoose;
const DBBase = db_base.DBBase;

////// 管理员表
var Admin = mongoose.model('admin', {
	id: String,//账号
	name: String,//姓名
	password: String//密码
}, 'admin')
// 管理员模型
class AdminDal extends DBBase {
	constructor() {
		super(Admin);
	}
}

////// 院系表
var Faculty = mongoose.model('faculty', {
	facultyName: String,//院系名称
	director: String,//系主任
	phone: String//电话
}, 'faculty')
// 院系模型
class FacultyDal extends DBBase {
	constructor() {
		super(Faculty);
	}
}

////// 专业表
var Major = mongoose.model('major', {
	majorName: String,//专业名称
}, 'major')
// 专业模型
class MajorDal extends DBBase {
	constructor() {
		super(Major);
	}
}

////// 班级表
var ClassInfo = mongoose.model('classInfo', {
	cyear: Number,//年级
	major: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "major"
	},//关联专业
	cno: Number,//班级
	className:String//班级名
}, "classInfo")
// 班级模型
class ClassInfoDal extends DBBase {
	constructor() {
		super(ClassInfo);
	}

	/**重写父类方法 根据查询条件取数据
     * 
     * @param  {[type]}   filter   查询条件
     * @param  {Function} callback 回调函数
     * @return {[type]}            [description]
     */
	getData(filter, callback) {
		this.model.count(filter)
			.then(count => {
				this.model.find(filter)
					.populate('major')
					.then(res => {
						callback(res, count)
					})
					.catch(err => {
						console.log(err)
					})
			})
	}
	/**分页取数据
     * @param  {[type]}   page     当前页码
     * @param  {[type]}   filter   查询条件
     * @param  {Function} callback 回调函数
     * @return {[type]}            [description]
     */
	getDataByPage(page, filter, callback) {
		var pageSize = global.pageSize //每页显示的数量
		this.model.count(filter) //统计记录数量
			.then(count => {
				// console.log(count)
				var pageCount = Math.ceil(count / pageSize)
				if (page > pageCount) { //防止页码超出范围
					page = pageCount
				}
				// 防止查询不到结果的时候page值变为0导致skip跳过的参数为负数
				if (page <= 0) {
					page = 1
				}
				// console.log('》》》》》》》》》》覆盖父类的方法》》》》》》》》》》》》》》》》》》》》》》》》》》');
				this.model.find(filter) //根据条件进行查询
					.populate('major')
					.limit(pageSize)
					.skip(pageSize * (page - 1))
					.sort({ _id: -1 })
					.then(res => {
						//返回两个数据 总页数和查询结果
						callback({ pageCount: pageCount, res: res })
					})
					.catch(err => {
						console.log(err)
					})
			})
	}
}

////// 学生表
var Student = mongoose.model('student', {
	name: String,//姓名
	sex: String,//性别
	id: Number,//学号
	phone: String,//电话
	address: String,//地址
	// facultyName: {//学院
	// 	type: mongoose.Schema.Types.ObjectId,
	// 	ref: "faculty"
	// },
	classInfo: {//班级
		type: mongoose.Schema.Types.ObjectId,
		ref: "classInfo"
	},
	birth: Date,//生日
	// account: String,//账号
	password: {
		type: String,
		default: "123"	//202cb962ac59075b964b07152d234b70，21218cca77804d2ba1922c33e0151105，e10adc3949ba59abbe56e057f20f883e
	}
	// avatar:String//头像

}, 'student')
// 学生模型
class StudentDal extends DBBase {
	constructor() {
		super(Student);
	}
	/** 分页取数据
     * @param  {[type]}   page     当前页码
     * @param  {[type]}   filter   查询条件
     * @param  {Function} callback 回调函数
     * @return {[type]}            [description]
     */
	getDataByPage(page, filter, callback) {
		var pageSize = global.pageSize //每页显示的数量
		this.model.count(filter) //统计记录数量
			.then(count => {
				// console.log(count)
				var pageCount = Math.ceil(count / pageSize)
				if (page > pageCount) { //防止页码超出范围
					page = pageCount
				}
				// 防止查询不到结果的时候page值变为0导致skip跳过的参数为负数
				if (page <= 0) {
					page = 1
				}
				// console.log('》》》》》》》》》》覆盖父类的方法》》》》》》》》》》》》》》》》》》》》》》》》》》');
				this.model.find(filter) //根据条件进行查询
					// .populate('facultyName')
					.populate({
						path: 'classInfo',
						populate: { path: 'major' }
					})
					.limit(pageSize)
					.skip(pageSize * (page - 1))
					.sort({ _id: -1 })
					.then(res => {
						//返回两个数据 总页数和查询结果
						callback({ pageCount: pageCount, res: res })
					})
					.catch(err => {
						console.log(err)
					})
			})
	}
}

////// 教师表
var Teacher = mongoose.model('teacher', {
	name: String,//姓名
	sex: String,//性别
	id: Number,//教师号
	phone: String,//电话
	// address: String,//地址
	faculty: {//学院
		type: mongoose.Schema.Types.ObjectId,
		ref: "faculty"
	},
	// className: {//班级
	// 	type: mongoose.Schema.Types.ObjectId,
	// 	ref: "classInfo"
	// },
	// account: String,//账号
	password: {
		type: String,
		default: "123"
	}
	// avatar:String//头像
}, 'teacher')
class TeacherDal extends DBBase {
	constructor() {
		super(Teacher);
	}
	/** 分页取数据
     * @param  {[type]}   page     当前页码
     * @param  {[type]}   filter   查询条件
     * @param  {Function} callback 回调函数
     * @return {[type]}            [description]
     */
	getDataByPage(page, filter, callback) {
		var pageSize = global.pageSize //每页显示的数量
		this.model.count(filter) //统计记录数量
			.then(count => {
				var pageCount = Math.ceil(count / pageSize)
				if (page > pageCount) { //防止页码超出范围
					page = pageCount
				}
				// 防止查询不到结果的时候page值变为0导致skip跳过的参数为负数
				if (page <= 0) {
					page = 1
				}
				this.model.find(filter) //根据条件进行查询
					.populate('faculty')
					.limit(pageSize)
					.skip(pageSize * (page - 1))
					.sort({ _id: -1 })
					.then(res => {
						//返回两个数据 总页数和查询结果
						callback({ pageCount: pageCount, res: res })
					})
					.catch(err => {
						console.log(err)
					})
			})
	}
}

////// 辅导员表
var Headteacher = mongoose.model('headteacher', {
	name: String,//姓名
	sex: String,//性别
	id: Number,//工号
	phone: String,//电话
	// address: String,//地址
	facultyName: {//学院
		type: mongoose.Schema.Types.ObjectId,
		ref: "faculty"
	},
	className: {//班级
		type: mongoose.Schema.Types.ObjectId,
		ref: "classInfo"
	},
	password: {
		type: String,
		default: "123"
	}
	// avatar:String//头像
}, 'headteacher')
class HeadteacherDal extends DBBase {
	constructor() {
		super(Headteacher);
	}
	/** 分页取数据
     * @param  {[type]}   page     当前页码
     * @param  {[type]}   filter   查询条件
     * @param  {Function} callback 回调函数
     * @return {[type]}            [description]
     */
	getDataByPage(page, filter, callback) {
		var pageSize = global.pageSize //每页显示的数量
		this.model.count(filter) //统计记录数量
			.then(count => {
				var pageCount = Math.ceil(count / pageSize)
				if (page > pageCount) { //防止页码超出范围
					page = pageCount
				}
				// 防止查询不到结果的时候page值变为0导致skip跳过的参数为负数
				if (page <= 0) {
					page = 1
				}
				this.model.find(filter) //根据条件进行查询
					.populate('facultyName')
					.populate({
						path: 'className',
						populate: { path: 'major' }
					})
					.limit(pageSize)
					.skip(pageSize * (page - 1))
					.sort({ _id: -1 })
					.then(res => {
						//返回两个数据 总页数和查询结果
						callback({ pageCount: pageCount, res: res })
					})
					.catch(err => {
						console.log(err)
					})
			})
	}
}

////// 课程表
var Course = mongoose.model('course', {
	courseName: String//课程名称
}, 'course')
// 课程模型
class CourseDal extends DBBase {
	constructor() {
		super(Course);
	}
}

////// 排课表
var Arrange = mongoose.model('arrange', {
	learnYear: String,//学年
	learnTerm: String,//学期

	classInfo: {//班级
		type: mongoose.Schema.Types.ObjectId,
		ref: "classInfo"
	},
	course: {//课程
		type: mongoose.Schema.Types.ObjectId,
		ref: "course"
	},
	teacher: {//教师
		type: mongoose.Schema.Types.ObjectId,
		ref: "teacher"
	},
	section: String,//节次
	classroom: String,//教室
}, 'arrange')
// 排课模型
class ArrangeDal extends DBBase {
	constructor() {
		super(Arrange)
	}
	/** 分页取数据
     * @param  {[type]}   page     当前页码
     * @param  {[type]}   filter   查询条件
     * @param  {Function} callback 回调函数
     * @return {[type]}            [description]
     */
	getDataByPage(page, filter, callback) {
		var pageSize = global.pageSize //每页显示的数量
		this.model.count(filter) //统计记录数量
			.then(count => {
				var pageCount = Math.ceil(count / pageSize)
				if (page > pageCount) { //防止页码超出范围
					page = pageCount
				}
				// 防止查询不到结果的时候page值变为0导致skip跳过的参数为负数
				if (page <= 0) {
					page = 1
				}
				this.model.find(filter) //根据条件进行查询
					.populate('teacher')
					.populate('course')
					.populate({
						path: 'classInfo',
						populate: { path: 'major' }
					})
					.limit(pageSize)
					.skip(pageSize * (page - 1))
					.sort({ _id: -1 })
					.then(res => {
						//返回两个数据 总页数和查询结果
						callback({ pageCount: pageCount, res: res })
					})
					.catch(err => {
						console.log(err)
					})
			})
	}
	
	/**重写父类方法 根据查询条件取数据
     * 
     * @param  {[type]}   filter   查询条件
     * @param  {Function} callback 回调函数
     * @return {[type]}            [description]
     */
	getData(filter, callback) {
		this.model.count(filter)
			.then(count => {
				this.model.find(filter)
					.populate('teacher')
					.populate('course')
					.populate({
						path: 'classInfo',
						populate: { path: 'major' }
					})
					.then(res => {
						console.log(res);
						callback(res, count)
					})
					.catch(err => {
						console.log(err)
					})
			})
	}
}

////// 点名表
var Rollcall = mongoose.model('rollcall', {
	classInfo: {//班级
		type: mongoose.Schema.Types.ObjectId,
		ref: "classInfo"
	},
	arrange: {//排课
		type: mongoose.Schema.Types.ObjectId,
		ref: "arrange"
	},
	rollcallTime: {//点名时间
		type: Date,
		default: Date.now()
	},
	actual: Number,//实到人数
	fact: Number//实际总人数
	//section: String,//节次
	//classroom: String,//教室
	//rollcallType: String,//考勤类别

	// teacher: {//教师
	// 	type: mongoose.Schema.Types.ObjectId,
	// 	ref: "teacher"
	// },
}, 'rollcall')
// 点名模型
class RollcallDal extends DBBase {
	constructor() {
		super(Rollcall)
	}
	/** 分页取数据
     * @param  {[type]}   page     当前页码
     * @param  {[type]}   filter   查询条件
     * @param  {Function} callback 回调函数
     * @return {[type]}            [description]
     */
	getDataByPage(page, filter, callback) {
		var pageSize = global.pageSize //每页显示的数量
		this.model.count(filter) //统计记录数量
			.then(count => {
				var pageCount = Math.ceil(count / pageSize)
				if (page > pageCount) { //防止页码超出范围
					page = pageCount
				}
				// 防止查询不到结果的时候page值变为0导致skip跳过的参数为负数
				if (page <= 0) {
					page = 1
				}
				this.model.find(filter) //根据条件进行查询
					.populate({
						path: 'arrange',
						populate: { path: 'course' }
					})
					.populate({
						path: 'classInfo',
						populate: { path: 'major' }
					})
					.limit(pageSize)
					.skip(pageSize * (page - 1))
					.sort({ _id: -1 })
					.then(res => {
						//返回两个数据 总页数和查询结果
						callback({ pageCount: pageCount, res: res })
					})
					.catch(err => {
						console.log(err)
					})
			})
	}
}

// 缺勤信息表
var Absence = mongoose.model('absence', {
	rollcall: {//点名信息
		type: mongoose.Schema.Types.ObjectId,
		ref: 'rollcall'
	},
	student: {//学生
		type: mongoose.Schema.Types.ObjectId,
		ref: 'student'
	},
	reson: String,//缺勤原因
}, 'absence')
// 课程模型
class AbsenceDal extends DBBase {
	constructor() {
		super(Absence);
	}
}

// 导出数据表和模型
module.exports = {
	Admin,
	AdminDal,
	Faculty,
	FacultyDal,
	Course,
	CourseDal,
	Major,
	MajorDal,
	ClassInfo,
	ClassInfoDal,
	Student,
	StudentDal,
	Teacher,
	TeacherDal,
	Headteacher,
	HeadteacherDal,
	Arrange,
	ArrangeDal,
	Absence,
	AbsenceDal,
	Rollcall,
	RollcallDal
}