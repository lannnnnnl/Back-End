const router = require('koa-router')()
router.prefix('/user')
const { add, login, del, find, updateUserInfo, updateState} = require('../controller/userController')

// 添加用户
router.post('/add', add)

// 用户登入
router.post('/login', login)

// 删除用户
router.delete('/del/:id', del)

// 获取用户数据列表
router.get('/find', find)

// 更新用户信息
router.post('/update/:id', updateUserInfo)

// 更新用户状态
router.put('/:id/state/:state', updateState)

module.exports = router
