const axios = require('axios')
const CONFIG = require('../../build/config')
function getTemplate (filename) {
    return new Promise((resolve, reject) => {
        axios.get(`http://localhost:${CONFIG.PORT}${CONFIG.PATH.PUBLIC_PATH}${CONFIG.DIR.VIEW}/${filename}`) // 注意这个 'public' 公共资源前缀非常重要
        .then(res => {
            resolve(res.data)
        })
        .catch(reject)
    })
}

module.exports = {
    getTemplate
}