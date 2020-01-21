/**
 * 获取墨迹天气数据
 * @param {Object} page 无头浏览器上下文
 * @returns {Object} object
 */
async function getWeatherData(page) {
	const weaTips = await getWeatherTips(page)
	const weatherDetail = await getWeatherDetail(page)
	return {
		weaTips,
		...weatherDetail
	}
}

// 获取天气提示
async function getWeatherTips(page) {
	var weatherTips = await page.$eval('.wea_tips em', (element) => element.innerText)
	return weatherTips
}

// 获取天气数据
async function getWeatherDetail(page) {
	const days = await page.$('.days')
	const li = await days.$$('li')
	const weaImg = await li[1].$eval('img', (ele) => ele.src)
	const weaStatus = await days.$eval('li:nth-child(1)', (ele) => ele.innerText)
	const weaTemp = await days.$eval('li:nth-child(2)', (ele) => ele.innerText)
	var wind = await days.$eval('li:nth-child(3)', (ele) => ele.innerText)
	wind = wind.replace(/\n/g, ' ')
	const air = await days.$eval('li:nth-child(4)', (ele) => ele.innerText)

	return {
		weaImg,
		weaStatus,
		weaTemp,
		wind,
		air
	}
}

module.exports = getWeatherData
