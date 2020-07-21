const puppeteer = require('puppeteer')
const city_list = require('../utils/city')
const schedule = require('node-schedule')
const {
	addSubscribeUser,
	getSubscribeUserAllList,
	getSubscribeUserListByName,
	removeSubscribeUserByTime,
	removeSubscribeUserById
} = require('./../utils/MySql')
let subscribeTime = null
let list = []
const searchTicket = async ({ time, formCityCode, toCityCode }) => {
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
	return new Promise((resolve) => {
		pageAir
			.goto(`http://www.ceair.com/booking/${formCityCode}-${toCityCode}-${time}_CNY.html`, {
				timeout: 1800000 //timeout here is 60 seconds
			})
			.then(async () => {
				let directAirlineList = await pageAir.evaluate(() => {
					let arr = Array.prototype.slice.call(document.querySelectorAll('.flight'))
					let directAirline = arr.filter((item) => {
						return item.querySelector('.zzjtzd').textContent === '直达'
					})
					return directAirline.map((item) => {
						let from = item.querySelector('.airport.r')
						let departureTime = from.querySelector('time') && from.querySelector('time').textContent
						let departureAirport = from.childNodes[1].textContent
						let to = item.querySelectorAll('.airport')[1]
						let arrivalTime = to.querySelector('time') && to.querySelector('time').textContent
						let arrivalAirport = to.childNodes[1].textContent
						return {
							departureTime,
							departureAirport,
							arrivalAirport,
							arrivalTime
						}
					})
				})
				browser.close()
				resolve(directAirlineList)
			})
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
	return new Promise(async (resolve, reject) => {
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
		let directAirline = await searchTicket(option)
		let data = sortDirectAirlineString(directAirline)
		resolve(data)
	})
}
const sortDirectAirlineString = (directAirline) => {
	let data = `\ufeff`
	directAirline.forEach(({ departureTime, departureAirport, arrivalAirport, arrivalTime }) => {
		data += `${departureTime.trim()}-${arrivalTime.trim()}|${departureAirport.trim()}-${arrivalAirport.trim()}\n`
	})
	return !!data.trim() ? data.trim() : '暂无航班'
}
const subscribeAir = (options) => {
	// DONE: 校验数据正确性存入数据库
	return new Promise(async (resolve, reject) => {
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
		let _list = await getSubscribeUserAllList()
		let option = {
			name: options.name,
			time,
			formCity: options.formCity,
			toCity: options.toCity
		}
		let repeat = _list.filter(
			(v) =>
				v.name == option.name &&
				v.time == option.time &&
				v.formCity == option.formCity &&
				v.toCity == option.toCity
		)
		if (repeat.length > 0) {
			resolve('请不要重复关注')
			return
		}
		let message = await addSubscribeUser(option)
		resolve(message)
		if (_list.length == 0) startSearchAir()
		if (_list.length != 0) list = await getSubscribeUserAllList()
	})
}

const startSearchAir = async (bot) => {
	// DONE:获取数据库记录，循环查询机票
	list = await getSubscribeUserAllList()
	var rule = new schedule.RecurrenceRule()
	rule.minute = [ 0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55 ]
	let index = 0
	subscribeTime = setInterval(async () => {
		list.length == 0 || (subscribeTime && clearInterval(subscribeTime))
		if (list.length == 0) return
		if (index >= list.length) index = 0
		let result = list[index]
		let user = await bot.Contact.find({
			name: result.name
		})
		result.formCityCode = searchCity(result.formCity)[0].code
		result.toCityCode = searchCity(result.toCity)[0].code
		let directAirline = await searchTicket(result)
		if (directAirline.length > 0) {
			let data = sortDirectAirlineString(directAirline)
			data =
				data +
				`\n跳转地址(请复制链接在浏览器打开)：http://www.ceair.com/booking/${result.formCityCode}-${result.toCityCode}-${result.time}_CNY.html\n** 已取消关注，如需继续关注请重新关注 **`
			user && user.say(data)
			user && removeSubscribeUserById(result.name, result.id)
		}
		index++
	}, 30000)
	// schedule.scheduleJob(rule, async () => {
	// 	if (index >= list.length) index = 0
	// 	let result = list[index]
	// 	let user = await bot.Contact.find({
	// 		name: result.name
	// 	})
	// 	result.formCityCode = searchCity(result.formCity)[0].code
	// 	result.toCityCode = searchCity(result.toCity)[0].code
	// 	let directAirline = await searchTicket(result)
	// 	if (directAirline.length > 0) {
	// 		subscribeTime && clearInterval(subscribeTime)
	// 		let data = sortDirectAirlineString(directAirline)
	// 		user.say(data)
	// 	}
	// 	index++
	// })
}
const searchAllSubscribAir = (name) => {
	return new Promise(async (resolve) => {
		getSubscribeUserListByName(name).then((list) => {
			let data = `\ufeff`
			list.map((v) => {
				data += `${v.id}.(${v.time.slice(2)})${v.formCity}-${v.toCity}`
			})
			if (list.length == 0) {
				resolve('暂无关注航班')
			}
			data = data + `\n** 删除请使用数标 **`
			resolve(data)
		})
	})
}
const delSubscribeUserById = (name, id) => {
	return new Promise(async (resolve) => {
		let Alist = await getSubscribeUserAllList()
		let has = Alist.filter((v) => v.name == name && v.id == id).lengtht
		if (has == 0) {
			resolve('查不到此数标绑定的航班')
			return
		}
		let message = await removeSubscribeUserById(name, id)
		resolve(message)
		let _list = await getSubscribeUserAllList()
		if (_list.length == 0) startSearchAir()
		if (_list.length != 0) list = await getSubscribeUserAllList()
	})
}
module.exports = {
	setBuyAirTicketPlan,
	startSearchAir,
	subscribeAir,
	searchAllSubscribAir,
	delSubscribeUserById
}
