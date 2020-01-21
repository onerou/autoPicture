const utils = require('../utils')
const config = require('../config')
const schedule = require('node-schedule')
const puppeteer = require('puppeteer')
const { FileBox } = require('file-box')
const getOneData = require('./get-data-one')
const getWeatherData = require('./get-data-weather')
const getTemp = require('./get-data-temp')
async function startScheduleJob(from) {
	try {
		const browser = await puppeteer.launch()
		// 获取墨迹天气数据
		const pageMoji = await browser.newPage()
		await pageMoji.goto(config.MOJI_HOST)
		const { weaTips, weaTemp, weaImg, weaStatus, wind } = await getWeatherData(pageMoji)
		// 获取One数据
		const pageOne = await browser.newPage()
		await pageOne.goto(config.ONE_HOST, {
			timeout: 1800000 //timeout here is 60 seconds
		})
		const { oneImg, oneWords, cont } = await getOneData(pageOne)
		// 关闭浏览器
		await browser.close()
		// 把取到的值赋给变量tempData
		global.tempData = {
			weaTips,
			weaTemp,
			weaImg,
			weaStatus,
			oneImg,
			wind,
			oneWords
		}
		// 重新启动一个浏览器，并截图
		await getTemp()
		// 给尾巴发消息
		if (from) {
			const fileBox = FileBox.fromFile(
				'./static/' + utils.parseTime(new Date().getTime(), '{y}{m}{d}') + config.TEP_PIC_NAME
			)
			from.say(fileBox)
			from.say(`今日好文：${cont[0].text}
					  好文链接：${cont[0].url}
			今日疑问：${cont[1].text}
					解惑链接：${cont[1].url}
			`)
		}
	} catch (err) {
		from.say('生成图片失败，请联系管理员')
		console.log('现在是\n', utils.parseTime(new Date().getTime(), '{y}-{m}-{d}  {h}:{i}:{s}'))
		console.log('错误：\n', err)
	}
}
module.exports = startScheduleJob
