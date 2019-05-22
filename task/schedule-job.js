const schedule = require('node-schedule')
const puppeteer = require('puppeteer')
const { FileBox } = require('file-box')
const config = require('../config')
const getOneData = require('./get-data-one')
const getWeatherData = require('./get-data-weather')
const getTemp = require('./get-data-temp')
const path = require('path')
const utils = require('../utils')
const {parseTime} = require('../utils')

/**
 * 开始定时任务
 * @param {Objcet} bot 微信机器人
 */
async function startScheduleJob(bot) {
  // 每日天气
  // schedule.scheduleJob(config.GETUP_TIME, async () => {
    try {
      const browser = await puppeteer.launch()
      // 获取墨迹天气数据
      const pageMoji = await browser.newPage()
      await pageMoji.goto(config.MOJI_HOST)
      const { weaTips, weaTemp, weaImg, weaStatus } = await getWeatherData(pageMoji)
      // 获取One数据
      const pageOne = await browser.newPage()
      await pageOne.goto(config.ONE_HOST)
      const { oneImg, oneWords } = await getOneData(pageOne)
      // 关闭浏览器
      await browser.close()
      // 把取到的值赋给变量tempData
      global.tempData = { weaTips, weaTemp, weaImg, weaStatus, oneImg, oneWords }
      // 重新启动一个浏览器，并截图
      await getTemp()
      // 给尾巴发消息
      const weiba = await bot.Contact.find({ alias: config.ALIAS })
      let date = utils.getDay(config.MEET_DAY)
      let str =utils.getDate() + '<br>' + '今天是我们在一起的第' + date + '天'
	  + '<br><br>今日天气早知道<br><br>' + weaTips +'<br><br>' +weaStatus+ '每日一句:<br><br>'+oneWords+'<br><br>'+'------来自最爱你的我'
      // weiba.say(str)
      console.log("TCL: startScheduleJob -> weiba", weiba)
      const fileBox = FileBox.fromFile('./static/'+utils.parseTime(new Date().getTime(),'{y}{m}{d}')+config.TEP_PIC_NAME)
      weiba.say(fileBox)
      console.log("TCL: startScheduleJob -> fileBox", fileBox)
    } catch (err) {
      console.log('现在是\n',utils.parseTime(new Date().getTime(),'{y}-{m}-{d}  {h}:{i}:{s}'))
      console.log('错误：\n', err)
    }
  // })

  // 喝水提醒
  const drinks = config.DRINK_TIME
  for (let drink of drinks) {
    schedule.scheduleJob(drink.time, async () => {
      try {
        const people = await bot.Contact.find({ alias: config.ALIAS })
        people.say(drink.words)
      } catch (err) {
      console.log('现在是\n', utils.parseTime(new Date().getTime(),'{y}-{m}-{d}  {h}:{i}:{s}'))
      console.log('错误：\n', err)
      }
    })
  }
}

module.exports = startScheduleJob
