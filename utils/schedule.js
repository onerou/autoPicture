const schedule = require("node-schedule")
const { removeTodoByTime } = require("../utils/MySql")
function setSchedule(name, time, todo) {
  schedule.scheduleJob(time, async () => {
    let user = await global.bot.Contact.find({
      name
    })
    user && (await user.say(`您该去${todo}了`))
    removeTodoByTime(time)
  })
}

module.exports = { setSchedule }
