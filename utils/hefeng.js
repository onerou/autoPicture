const key = "aaaaf44f8d364dc1b4efb5da315e508a"
var https = require("https")
var iconv = require("iconv-lite")
var pinyin = require("node-pinyin")
/**
 *
 *
 * @param {*} data
 *            * time     1. now 实况天气
 *            *          2. forecast 3-10天预报
 *            *          3. hourly 	逐小时预报
 *            *          4. lifestyle 生活指数
 *            * location 1. 城市ID
 *            *          2. 经纬度格式：经度,纬度
 *            *          3. 城市名称，支持中英文和汉语拼音
 *            *          4. 城市名称  西安,陕西
 *            *          5. IP
 * @response
 * Example
 * {
 *              "HeWeather6": [
 *                  {
 *                       "basic": {
 *                           "cid": "CN101200113",
 *                           "location": "洪山",
 *                           "parent_city": "武汉",
 *                           "admin_area": "湖北",
 *                           "cnty": "中国",
 *                           "lat": "30.50425911",
 *                           "lon": "114.40071869",
 *                           "tz": "+8.00"
 *                       },
 *                       "update": {
 *                           "loc": "2019-12-03 09:42",
 *                           "utc": "2019-12-03 01:42"
 *                       },
 *                       "status": "ok",
 *                       "now": {
 *                           "cloud": "91",
 *                           "cond_code": "101",
 *                           "cond_txt": "多云",
 *                           "fl": "5",
 *                           "hum": "100",
 *                           "pcpn": "0.0",
 *                           "pres": "1029",
 *                           "tmp": "6",
 *                           "vis": "6",
 *                           "wind_deg": "8",
 *                           "wind_dir": "北风",
 *                           "wind_sc": "1",
 *                           "wind_spd": "4"
 *                       }
 *                   }
 *               ]
 *           }
 */
const getRequest = data => {
  let { time = "now", type = "weather", location = "wuhan" } = data
  location = pinyin(location, {
    style: "normal" // 启用多音字模式
  })
    .reduce((acc, val) => acc.concat(val), [])
    .join("")
  let url = `https://free-api.heweather.net/s6/${type}/${time}?location=${location}&key=${key}`
  return new Promise((resolve, reject) => {
    https
      .get(url, function(res) {
        var datas = []
        var size = 0
        res.on("data", function(data) {
          datas.push(data)
          size += data.length
        })
        res.on("end", function() {
          var buff = Buffer.concat(datas, size)
          var result = iconv.decode(buff, "utf8")
          resolve(result)
        })
      })
      .on("error", function(err) {
        reject(err)
      })
  })
}

const request = {
  get: getRequest
}

module.exports = ({ data, type }) => {
  return request[type](data)
}
