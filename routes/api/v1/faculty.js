const exp = require('express');
const router = exp.Router();
const FacultyDal = require('../../../db').FacultyDal;
const facultyDal = new FacultyDal();

// 添加院系
router.post('/faculty',(req,res) => {
	facultyDal.save(req.body,(isOK) => {
		if (isOK) {
			res.json({status:'y',msg:'新增成功'})
		} else {
			res.json({status:'n',msg:'新增失败'})
		}
	})
})

module.exports = router;