const key = 'aaaaf44f8d364dc1b4efb5da315e508a'
var https = require('https')
var iconv = require('iconv-lite')
var pinyin = require('node-pinyin')

/**
 *
 *
 * @param {*} place String
 * @returns 根据地址名请求墨迹API返回详细信息：省份，全名 **县
 */
const getPlaceInfoRequest = (place) => {
	return new Promise((resolve, reject) => {
		let name = pinyin(place, {
			style: 'normal',
			heteronym: true
		})
		console.log('TCL: getPlaceInfoRequest -> name', name)
		let placePinyin = pinyin(place, {
			style: 'normal'
		})
			.reduce((acc, val) => acc.concat(val), [])
			.join('')
		let url = `https://tianqi.moji.com/api/citysearch/${placePinyin}`
		console.log('TCL: getPlaceInfoRequest -> url', url)
		https
			.get(url, function(res) {
				var datas = []
				var size = 0
				res.on('data', function(data) {
					datas.push(data)
					size += data.length
				})
				res.on('end', function() {
					var buff = Buffer.concat(datas, size)
					var result = iconv.decode(buff, 'utf8')
					console.log('TCL: getPlaceInfoRequest -> result', result)
					resolve(result)
				})
			})
			.on('error', function(err) {
				reject(err)
			})
	})
}

/**
 *
 *
 * @param {*} data String
 * @returns 墨迹天气根据地址返回的字符串格式
 */
const splitTpPinyin = (data) => {
	let placeLevel = {
		省: '',
		市: '',
		区: 'district',
		县: 'county'
	}
	if (typeof data !== 'string') {
		throw new Error('地名查询错误')
	}
	let len = data.length
	let utf8 = data.slice(0, len - 1)
	let level = data.slice(len - 1)
	let Ending = placeLevel[level].length >= 1 ? `-${placeLevel[level]}` : ''
	return (
		pinyin(utf8, {
			style: 'normal' // 启用多音字模式
		})
			.reduce((acc, val) => acc.concat(val), [])
			.join('') + Ending
	)
}

/**
 *
 *
 * @param {*} place String
 * @returns String 根据地名返回墨迹天气网页地址 
 */
const getmojsApiUrl = (place) => {
	return new Promise((resolve) => {
		getPlaceInfoRequest(place)
			.then((res) => {
				let city = JSON.parse(res).city_list[0]
				let pname = splitTpPinyin(city.localPname)
				let name = splitTpPinyin(city.localName)
				resolve(`https://tianqi.moji.com/weather/china/${pname}/${name}`)
			})
			.catch((err) => console.log)
	})
}

module.exports = getmojsApiUrl
