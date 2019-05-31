const axios = require('axios')
let url = 'http://www.tuling123.com/openapi/api'
module.exports = function (info, callback) {
    let param = {
        key: '59245c53ebbf4a538340013d792ff6f1',
        info,
        userid: 'ac6583b9ec853427'
    }
    axios.post(url, param).then(res => {
        callback(res.data.text)
    })
}