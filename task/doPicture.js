const utils = require('../utils');
const config = require('../config');
const schedule = require('node-schedule');
const puppeteer = require('puppeteer');

const getOneData = require('./get-data-one');
const getWeatherData = require('./get-data-weather');
const getTemp = require('./get-data-temp');
async function startScheduleJob(bot) {
    schedule.scheduleJob(config.GETUP_TIME, async () => {
        try {
            const browser = await puppeteer.launch();
            // 获取墨迹天气数据
            const pageMoji = await browser.newPage();
            await pageMoji.goto(config.MOJI_HOST);
            const {
                weaTips,
                weaTemp,
                weaImg,
                weaStatus
            } = await getWeatherData(pageMoji);
            // 获取One数据
            const pageOne = await browser.newPage();
            await pageOne.goto(config.ONE_HOST);
            const {
                oneImg,
                oneWords
            } = await getOneData(pageOne);
            // 关闭浏览器
            await browser.close();
            // 把取到的值赋给变量tempData
            global.tempData = {
                weaTips,
                weaTemp,
                weaImg,
                weaStatus,
                oneImg,
                oneWords
            };
            // 重新启动一个浏览器，并截图
            await getTemp();
            // 给尾巴发消息
        } catch (err) {
            console.log('现在是\n', utils.parseTime(new Date().getTime(), '{y}-{m}-{d}  {h}:{i}:{s}'));
            console.log('错误：\n', err);
        }
    });
}
module.exports = startScheduleJob;