const { Wechaty, config } = require('wechaty')
const generateQrcode = require('qrcode-terminal')
const startScheduleJob = require('./schedule-job')
const { parseTime } = require('../utils')
const configs = require('../config')
const tuLingBot = require('./bot')

/**
 * 登录微信，并开始执行定时任务
 */
function startTask() {
	var botFlag = true
	const bot = new Wechaty({
		profile: config.default.DEFAULT_PROFILE,
		name: 'YJ'
	})
	bot.on('scan', (qrcode, status) => {
		console.log(`扫描二维码: ${status}\nhttps://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(qrcode)}`)
		generateQrcode.generate(qrcode, function(code) {
			console.log(code)
		})
	})
	bot.on('login', (user) => {
		console.log(`用户 ${user} 登录成功`)
		// 登陆后创建定时任务
		startScheduleJob(bot)
	})
	bot.on('message', async (message) => {
		let from = message.from()
		let mentionSelf = message.mentionSelf()
		if (from.payload.alias == configs.ALIAS || from.payload.name == config.realName || mentionSelf) {
			if(message.text() == '机器人退下'){
				botFlag = false
				from.say(mentionSelf?'机器人已关闭':'臣告退~~')
			}
			if(botFlag && !mentionSelf){
				tuLingBot(message.text(), (text) => {
					text != '亲爱的，当天请求次数已用完。' && from.say(text)
				})
			}
			if(message.text() == '召唤机器人'){
				botFlag = true
				from.say(mentionSelf?'机器人已开启':'娘娘吉祥~~')
			}
			if (message.type() == bot.Message.Type.Audio) {
				const fileBox = await message.toFileBox()
				await fileBox.toFile(`./audio/${parseTime(new Date().getTime(), '{y}{m}{d}{h}{i}{s}')}.mp3`)
			}
		}
		if ((message.type() === bot.Message.Type.Text && !message.self()) || (await message.mentionSelf())) {
			console.log(
				`${parseTime(new Date().getTime(), '{y}/{m}/{d} {h}:{i}:{s}')}  ${from.payload.alias ||
					from.payload.name}: ${message.text()}(${message.age()}秒前)`
			)
		}
	})
	bot.start()
}

module.exports = startTask
