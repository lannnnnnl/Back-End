const mongoose = require('mongoose')
const {BASE_URL} = require('../config')
const {info, error} = require('../utils/log4js')

module.exports = () => {
    mongoose.connect(BASE_URL, {useNewUrlParser: true, useUnifiedTopology: true})
        .then(() => {
            console.log('连接数据库成功！')
        }).catch(err => {
        error('连接数据库失败！', err)
    })
}
