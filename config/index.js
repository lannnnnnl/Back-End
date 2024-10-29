const bcrypt = require('bcrypt')

module.exports = {
    BASE_URL: 'mongodb://127.0.0.1:27017/blog',
    // 密钥
    secretKey: 'xiaowu-2232304932@qq.com',
    // 生成 token 有效时间
    expiresIn: 3600 * 12,
    // 加密盐
    salt: bcrypt.genSalt(10)
}
