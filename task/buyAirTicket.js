const puppeteer = require('puppeteer')
const city_list = require('../utils/city')
let airUrl = 'http://www.ceair.com/booking/amnl-sha-200708_CNY.html?seriesid=774ad270b93c11eabc27b97e12d1d148'
const searchTicket = async ({ time, formCityCode, toCityCode }, resolve) => {
	const browser = await puppeteer.launch({
		defaultViewport: {
			width: 1400,
			height: 830
		},
		// devtools: true,
		headless: false
		// headless: true
	})
	const pageAir = await browser.newPage()
	pageAir
		.goto(`http://www.ceair.com/booking/${formCityCode}-${toCityCode}-${time}_CNY.html`, {
			timeout: 1800000 //timeout here is 60 seconds
		})
		.then(async () => {
			let data = await pageAir.evaluate(() => {
				let arr = Array.prototype.slice.call(document.querySelectorAll('.flight'))
				let data = `\ufeff `
				let directAirline = arr.filter((item) => {
					return item.querySelector('.zzjtzd').textContent === '直达'
				})
				directAirline.forEach((item) => {
					let from = item.querySelector('.airport.r')
					let departureTime = from.querySelector('time') && from.querySelector('time').textContent
					let departureAirport = from.childNodes[1].textContent
					let to = item.querySelectorAll('.airport')[1]
					let arrivalAirport = to.querySelector('time') && to.querySelector('time').textContent
					let arrivalTime = to.childNodes[1].textContent
					data += ` 出发时间:${departureTime}\n 出发地:${departureAirport}\n 到达时间:${arrivalAirport}\n 目的地:${arrivalTime}\n`
				})
				return data
			})
			await browser.close()
			resolve(data.trim())
		})
}
const searchCity = (city) => {
	return city_list.filter((v) => v.title.indexOf(city) != -1)
}
/**
 * examples: {
 *		time: '2020-07-08',
 *	 	formCity: 'amnl',
 *	 	toCity: 'sha'
 *	}
 *
 * @param {*} options
 * @returns
 */
const setBuyAirTicketPlan = (options) => {
	return new Promise((resolve, reject) => {
		if (!options.time) resolve('请输入时间')
		if (!options.formCity) resolve('请输入出发城市名')
		if (!options.toCity) resolve('请输入到达城市名')
		if (new Date(options.time) == 'Invalid Date') resolve('请输入正确的时间格式：年-月-日')
		let timeArr = options.time.split('-')
		let time = timeArr.join('').slice(2) // yy-mm-dd
		let formCity = searchCity(options.formCity)
		if (formCity.length == 0) resolve('找不到出发城市，请重新输入')
		if (formCity.length > 1) resolve(`请输入详细出发城市名，比如${formCity.map((v) => v.title).join(',')}`)
		let toCity = searchCity(options.toCity)
		if (toCity.length == 0) resolve('找不到到达城市，请重新输入')
		if (toCity.length > 1) resolve(`请输入详细到达城市名，比如${toCity.map((v) => v.title).join(',')}`)
		let option = {
			time,
			formCityCode: formCity[0].code,
			toCityCode: toCity[0].code
		}
		searchTicket(option, resolve)
		// resolve(`数据格式：${JSON.stringify(option, null, 4)}`)
	})
}
module.exports = {
	setBuyAirTicketPlan
}
