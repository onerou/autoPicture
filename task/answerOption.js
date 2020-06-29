let answer = new Map()
const { parseTime } = require('../utils')
const weather = require('../utils/hefeng.js')
const { search, insert, setTodoText } = require('../utils/MySql')
const timeTable = require('../utils/timeTable.js')
const { setSchedule } = require('../utils/schedule')
const TableConfig = require('../config/courseConfig')
const { stringToNumber } = require('../utils/utils')
const { removeTodo } = require('./todo')
const doPicture = require('./doPicture')
const nodeEmail = require('../utils/nodeEmail')
const { setRestartUser, getNewsUser, setNewsUser } = require('../utils/MySql')
const getWeatherInfo = require('../utils/weatherOption')
const { setBuyAirTicketPlan } = require('../task/buyAirTicket')
const shell = require('shelljs')
var exec = require('child_process').exec
answer.set(/(重启|重新启动|重启所有进程)/, async (regExp, text, name, from) => {
	let time = parseTime(new Date().getTime())
	from.say('正在添加记录，请稍后')
	let flag = await setRestartUser(name, time)
	return new Promise((resolve) => {
		if (!flag) resolve('重启失败，请联系管理员')
		from.say('开始重启，请稍后...')
		setTimeout(() => {
			resolve('重启成功')
			shell.exec('pm2 reload all')
		}, 3000)
	})
})
answer.set(/(更新|拉取)代码并(重启|重新启动|重启所有进程)/i, async (regExp, text, name, from) => {
	from.say('正在添加记录，请稍后')
	let flag = await setRestartUser(name, time)
	return new Promise((resolve) => {
		if (!flag) resolve('重启失败，请联系管理员')
		from.say('开始拉取代码，请稍后...')
		setTimeout(() => {
			exec('chcp 65001 && git pull', function(error, stdout, stderr) {
				let log = `${error ? 'error:' : ''}
				${error ? error : ''}

				${stdout ? 'stdout:' : ''}
				${stdout ? stdout : ''}
				
				${stderr ? 'stderr:' : ''}
				${stderr ? stderr : ''}
				`
				from.say(log.trim())
				if (error) resolve('请处理问题后重试')
				if (!error) resolve('重启成功,请等待')
				if (!error) shell.exec('pm2 reload all')
			})
			shell.exec(' git pull && pm2 reload all')
		}, 3000)
	})
})
answer.set(/(.*)(今天是|今天|现在|现在是)什么天气/i, async (regExp, text) => {
	let location = text.match(regExp)[1]
	let time = 'now'
	return new Promise((resolve) => {
		weather({
			data: {
				location,
				time
			},
			type: 'get'
		}).then((DATAres) => {
			let respond = JSON.parse(DATAres)
			if (!respond.HeWeather6 || respond.HeWeather6.length == 0) return
			let data = respond.HeWeather6[0]
			let { basic, now } = data
			let cont = `${basic.location}今天:\n
              天气:${now.cond_txt}，\n
              温度:${now.tmp}°C,\n
              体感温度：${now.fl}°C\n`
			resolve(cont)
		})
	})
})
answer.set(/(.*)(今天|现在|今天的|现在的)天气怎么样/i, async (regExp, text) => {
	let location = text.match(regExp)[1]
	let time = 'lifestyle'
	return new Promise((resolve) => {
		weather({
			data: {
				location,
				time
			},
			type: 'get'
		}).then((DATAres) => {
			let respond = JSON.parse(DATAres)
			if (!respond.HeWeather6 || respond.HeWeather6.length == 0) return
			let data = respond.HeWeather6[0]
			let { basic, lifestyle } = data
			let cont = ''
			lifestyle.map((v) => {
				cont += v.txt + '\n'
			})
			resolve(`${basic.location}今天:${cont}`)
		})
	})
})
answer.set(/会/g, async (regExp, text) => {
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve(`抱歉我并不会这个`)
		})
	})
})
answer.set(/当我说(.*)时你回答(.*)/i, async (regExp, text) => {
	let matchArr = text.match(regExp)
	return insert(matchArr[1], matchArr[2])
})

answer.set(/今天(有|上)(什么|哪些)课/i, async (regExp, text, name, from) => {
	from.say('正在查询中，请稍后...')
	return new Promise(async (resolve) => {
		let table
		try {
			table = await timeTable()
		} catch (error) {
			setTimeout(() => {
				resolve('教务处网络不佳，请稍后再试')
			})
		}
		let cont = table.length > 0 ? `` : '今天您可以好好休息了'
		table.map((v, i) => {
			if (v) {
				let Info = TableConfig[i]
				cont += `${Info.name}从${Info.startTime}到${Info.endTime}的${v.text}\n详情：\n学分：${v.fraction}\n课次：${v.studyNumber}\n${v.teacher}\n${v.room}\n${v.number}\n${v.other}\n`
			}
		})
		setTimeout(() => {
			resolve(cont)
		})
	})
})

answer.set(/提醒我今天(.*)点(.*)分去(.*)/i, async (regExp, text, name) => {
	let matchArr = text.match(regExp)
	let date = new Date()
	let month = date.getMonth() + 1
	let day = date.getDate()
	let time = `0 ${matchArr[2]} ${matchArr[1]} ${day} ${month} *`
	let todo = matchArr[3]
	setSchedule(name, time, todo)
	return setTodoText(name, time, todo)
})
answer.set(/提醒我明天(.*)点(.*)分去(.*)/i, async (regExp, text, name) => {
	let matchArr = text.match(regExp)
	let date = new Date()
	date.setTime(date.getTime() + 24 * 60 * 60 * 1000)
	let month = date.getMonth() + 1
	let day = date.getDate()
	let time = `0 ${matchArr[2]} ${matchArr[1]} ${day} ${month} *`
	let todo = matchArr[3]
	setSchedule(name, time, todo)
	return setTodoText(name, time, todo)
})
answer.set(/提醒我后天(.*)点(.*)分去(.*)/i, async (regExp, text, name) => {
	let matchArr = text.match(regExp)
	let date = new Date()
	date.setTime(date.getTime() + 24 * 60 * 60 * 1000 * 2)
	let month = date.getMonth() + 1
	let day = date.getDate()
	let time = `0 ${matchArr[2]} ${matchArr[1]} ${day} ${month} *`
	let todo = matchArr[3]
	setSchedule(name, time, todo)
	return setTodoText(name, time, todo)
})
answer.set(/提醒我(.*)天后(.*)点(.*)分去(.*)/i, async (regExp, text, name) => {
	let matchArr = text.match(regExp)
	let date = new Date()
	date.setTime(date.getTime() + 24 * 60 * 60 * 1000 * stringToNumber(matchArr[1]))
	let month = date.getMonth() + 1
	let day = date.getDate()
	let time = `0 ${matchArr[3]} ${matchArr[2]} ${day} ${month} *`
	let todo = matchArr[4]
	setSchedule(name, time, todo)
	return setTodoText(name, time, todo)
})
answer.set(/删除我今天(.*)点(.*)分的提醒/i, async (regExp, text, name) => {
	let matchArr = text.match(regExp)
	let date = new Date()
	let month = date.getMonth() + 1
	let day = date.getDate()
	let time = `0 ${matchArr[2]} ${matchArr[1]} ${day} ${month} *`
	return removeTodo(name, time)
})
answer.set(/生成今日图片/i, async (regExp, text, name, from) => {
	from.say('好的，请稍等')
	return new Promise(async (resolve, reject) => {
		await doPicture(from)
		setTimeout(() => {
			resolve()
		})
	})
})
answer.set(/执行命令(.*)/, async (regExp, text, name, from) => {
	let matchArr = text.match(regExp)
	from.say('好的，请稍等')
	return new Promise(async (resolve, reject) => {
		if (!matchArr[1]) {
			setTimeout(() => {
				resolve('请输入正确的命令')
			})
		}
		if (matchArr[1]) {
			exec('chcp 65001 && ' + matchArr[1], function(error, stdout, stderr) {
				let log = `${error ? 'error:' : ''}
				${error ? error : ''}

				${stdout ? 'stdout:' : ''}
				${stdout ? stdout : ''}
				
				${stderr ? 'stderr:' : ''}
				${stderr ? stderr : ''}
				`
				resolve(log.trim())
			})
		}
	})
})
answer.set(/给(.*)发邮件，主题是(.*)，内容是(.*)/i, async (regExp, text, name, from) => {
	let matchArr = text.match(regExp)
	let emailObj = {
		to: matchArr[1],
		title: matchArr[2],
		cont: matchArr[3]
	}
	return nodeEmail(emailObj)
})
answer.set(/查询(.*)最近的天气情况/, async (regExp, text, name, from) => {
	let matchArr = text.match(regExp)
	from.say('好的，请稍等')
	return new Promise(async (resolve, reject) => {
		getWeatherInfo(matchArr[1]).then((result) => {
			resolve(result)
		})
	})
})

answer.set(/查询新闻推送列表/, async (regExp, text, name, from) => {
	from.say('好的，请稍等')
	return new Promise(async (resolve, reject) => {
		getNewsUser().then((result) => {
			let message = result.map((v, i) => {
				return ` 
					${i + 1}、 ${v.user}
				`
			})
			resolve(message.join(''))
		})
	})
})
answer.set(/添加(.*)(至|到)新闻推送列表/, async (regExp, text, name, from) => {
	let matchArr = text.match(regExp)
	from.say('好的，请稍等')
	return new Promise(async (resolve, reject) => {
		setNewsUser(matchArr[1]).then((result) => {
			resolve('添加成功')
		})
	})
})
answer.set(/帮我查询(.*)月(.*)号从(.*)(飞|到)(.*)的机票/, async (regExp, text, name, from) => {
	let matchArr = text.match(regExp)
	if (matchArr.some((v) => !v)) {
		from.say('信息输入不完整，请重新输入')
		return
	}
	from.say('好的，请稍等')
	if (matchArr[1].length == 1) matchArr[1] = '0' + matchArr[1]
	if (matchArr[2].length == 1) matchArr[2] = '0' + matchArr[2]
	let obj = {
		time: `${new Date().getFullYear()}-${matchArr[1]}-${matchArr[2]}`,
		formCity: matchArr[3],
		toCity: matchArr[5]
	}
	return new Promise(async (resolve, reject) => {
		setBuyAirTicketPlan(obj).then((result) => {
			resolve('添加成功')
		})
	})
})
module.exports = answer
