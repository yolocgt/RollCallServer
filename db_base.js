// mongoose
var mongoose = require('mongoose')

// 建立数据库连接
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/RollCall2', {
    useMongoClient: true,
    promiseLibrary: global.Promise
});
mongoose.connection.on('open', function () {
    console.log('数据库连接成功~');
});
mongoose.connection.on('error', function (err) {
    console.log('数据库连接失败！' + err);
})

/**
 * 数据库操作基础模型
 */
class DBBase {
    constructor(model) {
        this.model = model
        this.mName = model.modelName;
    }

    /**
     * 保存数据到数据库
     * @param  {[type]}   m        需要保存的数据
     * @param  {Function} callback 回调函数
     * @return {[type]}            [description]
     */
    save(m, callback) {
        // console.log(m);
        var data = new this.model(m)
        data.save()
            .then(callback(true, data))
            .catch(err => {
                console.log(err)
            })
    }

    /**
     * 根据id删除指定的记录
     * @param  {[type]}   id       需要删除的id
     * @param  {Function} callback 回调函数
     * @return {[type]}            [description]
     */
    delById(id, callback) {
        this.model.findByIdAndRemove(id)
            .then(callback(true))
            .catch(err => {
                console.log(err)
                callback(false)
            })
    }
    
    /**
     * @description 根据条件删除指定的记录
     * @author CGT
     * @param {any} filter 删除条件
     * @param {function} callback 回调函数
     * @memberof DBBase
     */
    delMany(filter, callback) {
        this.model.remove(filter)
            .then(callback(true))
            .catch(err => {
                console.log(err)
                callback(false)
            })
    }

    /**
     * 根据id更新指定的记录
     * @param  {[type]}   id       需要更新的记录id
     * @param  {[type]}   model    需要更新到数据库的数据
     * @param  {Function} callback [description]
     * @return {[type]}            [description]
     */
    updateByID(id, model, callback) {
        this.model.findByIdAndUpdate(id, model)
            .then(callback(true))
            .catch(err => {
                console.log(err)
                callback(false)
            })
    }

    /**
     * 根据id获取单条记录
     * @param  {[type]}   id       获取数据的id
     * @param  {Function} callback 回调函数
     * @return {[type]}            [description]
     */
    findByID(id, callback) {
        this.model.findById(id)
            .then(res => {
                callback(res)
            })
            .catch(err => {
                console.log(err)
                callback(null)
            })
    }

    /**
     * 根据查询条件取数据
     * @param  {[type]}   filter   查询条件
     * @param  {Function} callback 回调函数
     * @return {[type]}            [description]
     */
    getData(filter, callback) {
        // console.log('筛选条件：');
        // console.log(filter);
        this.model.count(filter)
            .then(count => {
                this.model.find(filter)
                    .then(res => {
                        // console.log('结果：：');
                        // console.log(res);
                        callback(res)
                    })
                    .catch(err => {
                        console.log(err)
                    })
            })
    }

    /**
     * 分页取数据
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
                console.log('db_base 查询条件 ');
                console.log(filter);
                this.model.find(filter) //根据条件进行查询
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

// 导出数据库操作基础模型，mongoose
module.exports = { DBBase: DBBase, mongoose: mongoose }
