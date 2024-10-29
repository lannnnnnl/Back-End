const User = require('../models/users')
const {generateToken} = require('../utils/jwt')
const {success, fail, pageQuery} = require('../utils')
const {debug, info, error} = require('../utils/log4js')

/***
 * 添加用户
 * @param ctx
 * @returns {Promise<void>}
 */
const add = async ctx => {
    const params = ctx.request.body
    await User.findOne({username: params.username}).then(async result => {
        if (result) return ctx.body = fail('用户名已存在！', 400)
        await User.create(params).then(result => {
            if (!result) ctx.body = fail('添加用户失败！')
            ctx.body = success('添加用户成功')
        })
    })
}

/***
 * 用户登入
 * @param ctx
 * @returns {Promise<void>}
 */
const login = async ctx => {
    const {username, password} = ctx.request.body
    console.log(username, password)
    await User.findOne({username, state: true}).then(async result => {
        if (!result) return ctx.body = fail('该账号已被禁用，请联系管理员！')
        // 输入密码与hash密码进行判断
        const isValid = await result.isValidPassword(password)
        if (!isValid) return ctx.body = fail('用户名或密码错误！', 401)
        // 更新最后一次登入时间
        let data = await User.findOneAndUpdate({ _id: result._id }, { lastLogin_time: Date.now() })
        data = data._doc // 将mongoose模型对象转换为js对象->可操作
        delete data.password
        data.token = 'Bearer ' + generateToken(data)
        ctx.body = success('登入成功！', data)
    })
}

/***
 * 删除用户
 * @param ctx
 * @returns {Promise<void>}
 */
const del = async ctx => {
    const { id } = ctx.params
    await User.findByIdAndDelete({ _id: id }).then(result => {
        if (!result) return ctx.body = fail('删除用户失败！')
        info('删除用户' + result)
        ctx.body = success('删除用户成功！')
    })
}

/***
 * 获取用户数据列表
 * @param ctx
 * @returns {Promise<void>}
 */
const find = async ctx => {
    const { query } = ctx.query
    const like = {
        $or: [
            { username: { $regex: new RegExp(query, 'i') } }
        ]
    }
    await pageQuery(ctx, User, like, '获取用户数据列表成功！', '获取用户数据列表失败！')
}

/***
 * 更新用户状态
 * @param ctx
 * @returns {Promise<void>}
 */
const updateState = async ctx => {
    const { id, state } = ctx.params
    await User.updateOne({ _id: id }, { state }).then(result => {
        if (!result || result.modifiedCount === 0) return ctx.body = fail('更新用户状态失败！')
        ctx.body = success('更新用户状态成功！')
    })
}

/***
 * 更新用户信息
 * @param ctx
 * @returns {Promise<void>}
 */
const updateUserInfo = async ctx => {
    const params = ctx.request.body
    const { id } = ctx.params
    await User.updateOne({ _id: id }, params).then(result => {
        if (!result || result.modifiedCount === 0) return ctx.body = fail('修改用户信息失败！')
        ctx.body = success('更新用户信息成功！')
    })
}

module.exports = {
    add,
    login,
    del,
    find,
    updateUserInfo,
    updateState
}
