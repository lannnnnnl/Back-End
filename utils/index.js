const log4js = require('./log4js')
// 状态码
const STATUS = {
    SUCCESS: 200, // 成功
    PARAMS_ERROR: 400, // 参数错误
    USER_PASSWORD_ERROR: 402, // 用户名或密码错误
    USER_LOGIN_ERROR: 403, // 用户未登入
    AUTH_ERROR: 401, // 用户未认证或认证失败
    BUSINESS_ERROR: 422, // 业务请求失败
    ERROR: 500 // 服务端出现异常
}

// 成功
function success (msg = '', data = '', status = STATUS.SUCCESS) {
    if (data === '') return {
        status,
        msg
    }
    return {
        status,
        msg,
        data
    }
}
// 分页的查询数据
function page (msg = '', data = '', total = 0, count = 0, status = STATUS.SUCCESS) {
    return {
        status,
        msg,
        data,
        total,
        count
    }
}
// 业务请求失败
function fail (msg = '', status = STATUS.BUSINESS_ERROR) {
    log4js.error(msg)
    return {
        status,
        msg
    }
}
// 服务端异常
function error (msg = '', status = STATUS.ERROR) {
    log4js.error(msg)
    return {
        status,
        msg
    }
}
// 处理分页数据
async function pageQuery (ctx, model, like, successMsg, errMsg) {
    let { query, pagenum, pagesize } = ctx.query
    // 判断参数
    if (isNaN(Number(pagenum)) || isNaN(Number(pagesize))) {
        return ctx.body = fail('参数错误！', STATUS.PARAMS_ERROR)
    }
    pagenum = Number(pagenum)
    pagesize = Number(pagesize)

    let q = null
    if (query) {
        q = like
    }
    // 数据总数
    let total = 0
    total = await model.find( q ).count()

    // 计算总页码
    let count = 0
    if (total > 0) {
        count = Math.ceil(total / pagesize)
    }

    if (count > 0 && pagenum > count) {
        pagenum = count
    } else if (pagenum < 1) {
        pagenum = 1
    }

    // 计算起始位置
    let start = (pagenum - 1) * pagesize

    // 对结果进行模糊查询和分页
    return await model.find( q ).skip(start).limit(pagesize).then(result => {
        if (!result) return ctx.body = this.fail(errMsg)
        ctx.body = page(successMsg, result, total, count)
    })
}

module.exports = {
    success,
    fail,
    page,
    pageQuery,
    error
}
