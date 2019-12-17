const startScheduleJob = require("./schedule-job")
const { setTodo, setTimeTableTodo } = require("./todo")
const configs = require("../config")
const { getRestartUser } = require("../utils/MySql")
module.exports = async function(user) {
  console.log(`用户 ${user} 登录成功`)
  let userNameList = await getRestartUser()
  if (!userNameList) user.say("服务器错误")
  if (userNameList.length == 0) return
  let lastUser = userNameList[userNameList.length - 1].userName
  let weiba = await bot.Contact.find({
    name: lastUser
  })
  if (!weiba) {
    weiba = await bot.Contact.find({
      alias: lastUser
    })
  }
  if (user.payload.name == lastUser) weiba = user
  weiba && (await weiba.say(configs.restartText))
  // 登陆后创建定时任务
  startScheduleJob(global.bot)
  setTodo()
  setTimeTableTodo()
}
