const puppeteer = require('puppeteer')
const city_list = require('../utils/city')
let airUrl = 'http://www.ceair.com/booking/amnl-sha-200708_CNY.html?seriesid=774ad270b93c11eabc27b97e12d1d148'
const searchTicket = async (options) => {
	let time = options.time.split('-').join('').slice(2) // 时间戳
	let formCity = searchCity(options.formCity)
	if (formCity.length == 0) return '找不到出发城市，请重新输入'
	if (formCity.length > 1) return `请输入详细城市名，比如${formCity.map((v) => v.title).join(',')}`
	let toCity = searchCity(options.toCity)
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
		.goto(`http://www.ceair.com/booking/${formCity}-${toCity}-${time}_CNY.html`, {
			timeout: 1800000 //timeout here is 60 seconds
		})
		.then(async () => {
			let data = await pageAir.evaluate(() => {
				let arr = Array.prototype.slice.call(document.querySelectorAll('.flight'))
				let data = `\ufeff 出发时间,出发地,目的地,到达时间\n`
				let directAirline = arr.filter((item) => {
					return item.querySelector('.zzjtzd').textContent === '直达'
				})
				directAirline.forEach((item) => {
					let from = item.querySelector('.airport.r')
					let departureAirport = from.querySelector('time') && from.querySelector('time').textContent
					let departureTime = from.childNodes[1].textContent
					let to = item.querySelectorAll('.airport')[1]
					let arrivalAirport = to.querySelector('time') && to.querySelector('time').textContent
					let arrivalTime = to.childNodes[1].textContent
					data += `${departureAirport},${departureTime},${arrivalAirport},${arrivalTime}\n`
				})
				return data
			})
			console.log('searchTicket -> data', data)
		})
}
const searchCity = (city) => {
	return city_list.filter((v) => v.title.indexOf(city) != -1)
}
const setBuyAirTicketPlan = (options) => {
	return new Promise((resolve, reject) => {
		if (!options.time) resolve('请输入时间')
		if (!options.formCity) resolve('请输入出发城市名')
		if (!options.toCity) resolve('请输入到达城市名')
		try {
			new Date(options.time)
		} catch (err) {
			resolve('请输入正确的时间格式：yyyy-mm-dd')
		}
		let timeArr = options.time.split('-')
		let time = timeArr.join('').slice(2) // yy-mm-dd
		let formCity = searchCity(options.formCity)
		if (formCity.length == 0) resolve('找不到出发城市，请重新输入')
		if (formCity.length > 1) resolve(`请输入详细出发城市名，比如${formCity.map((v) => v.title).join(',')}`)
		let toCity = searchCity(options.toCity)
		if (toCity.length == 0) resolve('找不到到达城市，请重新输入')
		if (toCity.length > 1) resolve(`请输入详细到达城市名，比如${toCity.map((v) => v.title).join(',')}`)
		resolve(`数据格式：${JSON.string({ time, formCity, toCity }, null, 4)}`)
	})
}

let options = {
	time: '2020-07-08',
	formCity: 'amnl',
	toCity: 'sha'
}
module.exports = {
	setBuyAirTicketPlan
}
