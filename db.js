const db_base = require('./db_base')
const mongoose = db_base.mongoose;
const DBBase = db_base.DBBase;

////// 管理员表
var Admin = mongoose.model('admin', {
	account: String,//账号
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

// 班级表
var ClassInfo = mongoose.model('classInfo', {
	major: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "major"
	},//关联专业
	cyear: Number,//年级
	cno: Number//班级
})
// 班级模型
class ClassInfoDal extends DBBase {
	constructor() {
		super(ClassInfo);
	}
}

// 学生表
var Student = mongoose.model('student', {

})

// 教师表
var Teacher = mongoose.model('teacher', {

})



// 课程表
var Course = mongoose.model('course', {
	courseName: String//课程名称
}, 'course')
// 课程模型
class CourseDal extends DBBase {
	constructor() {
		super(Course);
	}
}
module.exports = {
	Admin,
	AdminDal,
	Faculty,
	FacultyDal,
	Course,
	CourseDal
	// Student, Teacher, Faculty, Course
}