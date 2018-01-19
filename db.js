const db_base=require('./db_base')
const mongoose = db_base.mongoose;
const DBBase = db_base.DBBase;

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/RollCall', {
	useMongoClient: true,
	promiseLibrary: global.Promise
});

mongoose.connection.on('open', function () {
	console.log('数据库连接成功');
});
mongoose.connection.on('error', function (err) {
	console.log('数据库连接失败' + err);
})

// 管理员表
var Admin = mongoose.model('admin', {
	account: String,//账号
	name: String,//姓名
	password: String//密码
},'admin')	
// 管理员模型
class AdminDal extends DBBase{
	constructor() {
		super(Admin);
	}
}
// 学生表
var Student = mongoose.model('student', {

})

// 教师表
var Teacher = mongoose.model('teacher', {

})

// 院系表
var Faculty = mongoose.model('faculty', {
	facultyName: String,//院系名称
	director: String,//系主任
	phone:String//电话
},'faculty')
// 院系模型
class FacultyDal extends DBBase{
	constructor() {
		super(Faculty);
	}
}

// 课程表
var Course = mongoose.model('course', {
	
})

module.exports = {
	Admin,
	AdminDal,
	Faculty,
	FacultyDal
	// Student, Teacher, Faculty, Course
}