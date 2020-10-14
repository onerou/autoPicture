const { Wechaty, config } = require('wechaty')
const generateQrcode = require('qrcode-terminal')
const { parseTime } = require('../utils')
const configs = require('../config')
const tuLingBot = require('./bot')
const answer = require('./answer')
const answerOption = require('./answerOption')
// const notifier = require("../utils/notifier")
const login = require('./login')
/**
 * 登录微信，并开始执行定时任务
 */
function startTask() {
	global.bot = new Wechaty({
		profile: config.default.DEFAULT_PROFILE,
		name: 'YJ'
	})
	bot.on('scan', (qrcode, status) => {
		console.log(`扫描二维码: ${status}\nhttps://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(qrcode)}`)
		generateQrcode.generate(qrcode, function(code) {
			console.log(code)
		})
	})
	bot.on('login', login)
	bot.on('message', async (message) => {
		let from = message.from()
		let to = message.to()
		let text = message.text()
		let username = from.payload.name
		let mentionSelf = await message.mentionSelf()
		if (/jarvis/g.exec(text)) {
			if (/^jarvis$/.exec(text)) {
				let callAnswer = from.payload.alias == configs.ALIAS ? '我在，主人' : '是的，我在'
				from.say(callAnswer)
				let str = `|分割的代表可选项，(.*)代表可替换文字
        `
				let index = 1
				answerOption.forEach(function(key, i) {
					let dir = i.toString().replace(/(\/|i|g)/g, '')
					str += `${index++}.${dir}
          `
				})
				from.say(str)
			}
			if (text.replace(/jarvis/, '').length > 1 && text !== configs.restartText) {
				answer(text.replace(/jarvis/, ''), username, from)
					.then((result) => {
						result && from.say(result)
					})
					.catch((err) => {
						console.log(`${parseTime(new Date().getTime(), '{y}/{m}/{d} {h}:{i}:{s}')}TCL->answer err`, err)
					})
			}
			// tuLingBot(message.text(), text => {
			//   text != "亲爱的，当天请求次数已用完。" && from.say(text)
			// })
		}
		if (message.type() == bot.Message.Type.Audio) {
			const fileBox = await message.toFileBox()
			// await fileBox.toFile(
			// 	`./audio/from.payload.name-${parseTime(new Date().getTime(), '{y}{m}{d}{h}{i}{s}')}.mp3`
			// )
		}
		if ((message.type() === bot.Message.Type.Text && !message.self()) || (await message.mentionSelf())) {
			let messageObj = {
				userName: from.payload.name,
				alias: from.payload.alias,
				message: message.text(),
				autograph: '',
				time: parseTime(new Date().getTime(), '{h}:{i}:{s}'),
				isLogin: true,
				type: from.payload.alias == configs.ALIAS ? 'love' : 'friend'
			}
			if (global.clients[0]) global.clients[0].send(JSON.stringify(messageObj))
			console.log(
				`${parseTime(new Date().getTime(), '{h}:{i}:{s}')} ${message.room() || ''} ${from.payload.alias ||
					from.payload.name}: ${message.text()}(${message.age()}秒前)`
			)
		}
	})
	bot.start()
}

module.exports = startTask
