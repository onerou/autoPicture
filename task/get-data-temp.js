const path = require('path')
const puppeteer = require('puppeteer')
const config = require('../config')
const {
  parseTime
} = require('../utils')

async function getTemplate(weaTemp, weaImg, weaStatus, weaTips, oneImg, oneWords) {
  const browser = await puppeteer.launch({
    defaultViewport: {
      width: 375,
      height: 667
    }
  })
  const page = await browser.newPage()
  await page.goto(config.TEP_HOST)
  await page.screenshot({
    path: path.join('static/' + parseTime(+new Date().getTime(), '{y}{m}{d}') + config.TEP_PIC_NAME)
  })
  await browser.close()
  console.log("TCL: getTemplate -> temp", '保存图片成功')
}

module.exports = getTemplate