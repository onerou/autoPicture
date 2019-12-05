const { Wechaty, config } = require("wechaty")
const generateQrcode = require("qrcode-terminal")
const startScheduleJob = require("./schedule-job")
const { parseTime } = require("../utils")
const configs = require("../config")
const tuLingBot = require("./bot")
const answer = require("./answer")
/**
 * 登录微信，并开始执行定时任务
 */
function startTask() {
  const bot = new Wechaty({
    profile: config.default.DEFAULT_PROFILE,
    name: "YJ"
  })
  bot.on("scan", (qrcode, status) => {
    console.log(
      `扫描二维码: ${status}\nhttps://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(
        qrcode
      )}`
    )
    generateQrcode.generate(qrcode, function(code) {
      console.log(code)
    })
  })
  bot.on("login", async user => {
    console.log(`用户 ${user} 登录成功`)
    // 登陆后创建定时任务
    startScheduleJob(bot)
    let weiba = await bot.Contact.find({
      name: configs.realName
    })
    if (!weiba) {
      weiba = await bot.Contact.find({
        alias: configs.ALIAS
      })
    }
    // weiba && (await weiba.say("jarvis已启动"))
  })
  bot.on("message", async message => {
    let from = message.from()
    let text = message.text()
    // let mentionSelf = message.mentionSelf()
    // if (
    //   from.payload.alias == configs.ALIAS ||
    //   from.payload.name == config.realName
    // ) {

    if (/jarvis/g.exec(text)) {
      if (/^jarvis$/.exec(text))
        from.say(
          from.payload.alias == configs.ALIAS ? "我在，主人" : "是的，我在"
        )
      if (text.replace(/jarvis/, "").length > 1 && text !== "jarvis已启动") {
        answer(text.replace(/jarvis/, "")).then(result => {
          from.say(result)
        })
      }

      // tuLingBot(message.text(), text => {
      //   text != "亲爱的，当天请求次数已用完。" && from.say(text)
      // })
    }
    if (message.type() == bot.Message.Type.Audio) {
      const fileBox = await message.toFileBox()
      await fileBox.toFile(
        `./audio/${parseTime(new Date().getTime(), "{y}{m}{d}{h}{i}{s}")}.mp3`
      )
    }
    // }
    if (
      (message.type() === bot.Message.Type.Text && !message.self()) ||
      (await message.mentionSelf())
    ) {
      console.log(
        `${parseTime(new Date().getTime(), "{y}/{m}/{d} {h}:{i}:{s}")}  ${from
          .payload.alias ||
          from.payload.name}: ${message.text()}(${message.age()}秒前)`
      )
    }
  })
  bot.start()
}

module.exports = startTask
