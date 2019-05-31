const {
  Wechaty
} = require('wechaty');
const generateQrcode = require('qrcode-terminal');
const startScheduleJob = require('./schedule-job');
const {
  parseTime
} = require('../utils');
const {
  FileBox
} = require('file-box');
const utils = require('../utils');
const config = require('../config');
const tuLingBot = require('./bot');

/**
 * 登录微信，并开始执行定时任务
 */
function startTask() {
  const bot = new Wechaty();
  bot.on('scan', (qrcode, status) => {
    console.log(`扫描二维码: ${status}\nhttps://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(qrcode)}`);
    generateQrcode.generate(qrcode, function (code) {
      console.log(code);
    });
  });
  bot.on('login', (user) => {
    console.log(`用户 ${user} 登录成功`);
    // 登陆后创建定时任务
    startScheduleJob(bot);
  });
  bot.on('message', async (message) => {
    let from = message.from();
    if ((message.type() === bot.Message.Type.Text && !message.self()) || (await message.mentionSelf())) {
      if (from.payload.alias == config.ALIAS) {
        tuLingBot(message.text(), text => {
          from.say(text)
        })
      }
      console.log(
        `${parseTime(new Date().getTime(), '{y}/{m}/{d} {h}:{i}:{s}')}  ${from.payload.alias ||
					from.payload.name}: ${message.text()}(${message.age()}秒前)`
      );
    }
  });
  bot.start();
}

module.exports = startTask;