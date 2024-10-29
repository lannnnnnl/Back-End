const jwt = require('jsonwebtoken')
const {secretKey, expiresIn} = require('../config')

// 生成 token
const generateToken = payload => {
    return jwt.sign(payload, secretKey, {expiresIn})
}

// 解密 token
const verifyToken = token => {
    try {
        const payload = jwt.verify(token, secretKey)
        return {success: true, payload}
    } catch (error) {
        return {success: false, message: error.message}
    }
}

module.exports = {
    generateToken,
    verifyToken
}
