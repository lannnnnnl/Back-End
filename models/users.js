const mongoose = require('mongoose')
const {salt} = require('../config')
const bcrypt = require('bcrypt')

const UserSchema = new mongoose.Schema({
    username: String,
    password: {
        type: String,
        select: true
    },
    age: Number,
    address: String,
    email: String,
    phone: String,
    sex: {
        type: String,
        default: '男'
    },
    icon: String,
    state: {
        type: Boolean,
        default: true // 用户状态 1: 启用 2: 禁用
    },
    create_time: {
        type: String,
        default: Date.now()
    },
    // 最后一次登入时间
    lastLogin_time: {
        type: String,
        default: Date.now()
    }
})

// 使用 pre-save 钩子函数来哈希密码
UserSchema.pre('save', async function (next) {
    const user = this
    if (!user.isModified('password')) return next()
    user.password = await bcrypt.hash(user.password, await salt)
    next()
})

// 验证用户密码
UserSchema.methods.isValidPassword = async function (password) {
    const user = this
    return await bcrypt.compare(password, user.password)
}

const User = mongoose.model('users', UserSchema)

module.exports = User
