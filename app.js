const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const jwt = require('koa-jwt')
const {secretKey} = require('./config')
const cors = require('koa-cors')

const router = require('koa-router')()
// 配置 log4js 处理日志
const log4js = require('./utils/log4js')
// mongoose 连接数据库
const db = require('./db')
db()

const users = require('./routes/users')

// error handler
onerror(app)

// middlewares
app.use(bodyparser({
    enableTypes: ['json', 'form', 'text']
}))
app.use(cors())
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
    extension: 'pug'
}))

// 错误级别中间件
app.use(async (ctx, next) => {
    try {
        await next()
    } catch (err) {
        if (err.status === 401) {
            ctx.status = 401
            ctx.body = {
                status: 401,
                msg: '用户认证失败！'
            }
        } else {
            throw err
        }
    }
})

// 验证认证用户中间件
app.use(jwt({
    secret: secretKey
}).unless({
    path: [/^\/api\/user\/login/]
}))

// logger
app.use(async (ctx, next) => {
    const start = new Date()
    await next()
    const ms = new Date() - start
    console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})


// 配置路由根路径
router.prefix('/api')
router.use(users.routes(), users.allowedMethods())

// routes
app.use(router.routes(), router.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
    console.error('server error', err, ctx)
    log4js.error(err)
});

module.exports = app
