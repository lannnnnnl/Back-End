const log4js = require('log4js')

log4js.configure({
    // 添加追加器
    appenders: {
        out: {type: 'file', filename: 'logs/common.log'},
        info: {type: 'file', filename: 'logs/common.log'},
        error: {
            type: 'dateFile',
            filename: 'logs/error-',
            pattern: 'yyyy-MM-dd.log',
            alwaysIncludePattern: true
        }
    },
    categories: {
        default: { appenders: ['out'], level: 'debug' },
        info: { appenders: ['info'], level: 'info' },
        error: { appenders: ['error'], level: 'error' }
    }
})

module.exports = {
    debug (content) {
        const logger = log4js.getLogger('debug')
        logger.level = 'debug'
        logger.debug(content)
    },
    info (content) {
        const logger = log4js.getLogger('info')
        logger.level = 'info'
        logger.info(content)
    },
    error (content) {
        const logger = log4js.getLogger('error')
        logger.level = 'error'
        logger.error(content)
    }
}
