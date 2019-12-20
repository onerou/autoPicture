const { setSchedule } = require("../utils/schedule")
const { getTodoList, removeTodoByTime } = require("../utils/MySql")
const timeTable = require("../utils/timeTable.js")
const TableConfig = require("../config/courseConfig")
const { parseTime } = require("../utils")
function setTodo() {
  getTodoList().then(res => {
    if (!res.map) return
    res.map(v => {
      setSchedule(v.userName, v.time, v.todo)
    })
  })
}
function removeTodo(user, time) {
  return new Promise((resolve, reject) => {
    removeTodoByTime(user, time).then(res => {
      resolve(res)
    })
  })
}

function setTimeTableTodo() {
  timeTable()
    .then(res => {
      console.log("TCL: setTimeTableTodo -> res", res)
      if (!res.map) return
      res.map((v, i) => {
        if (!v) return
        let Info = TableConfig[i]
        let isFirstClass = i == 0 || i == 2 || i == 4 || res[i - 1] == null
        let remindMine = isFirstClass ? 40 : 25
        let remindGo = `上${v.text}，${v.room.replace("：", "在")}`
        if (remindGo[remindGo.length - 1] == "了")
          remindGo = remindGo.replace(/了/, "")
        let remindChanging =
          res[i - 1] && res[i - 1].room == v.room
            ? "课间休息喽，喝杯水，提神醒脑，想我就给我发消息哦"
            : "下课咯，赶紧换教室"
        let remindText = isFirstClass ? remindGo : remindChanging
        let YMD =
          parseTime(new Date().getTime(), "{y}-{m}-{d}") + " " + Info.startTime
        let date = new Date(YMD)
        date.setTime(date.getTime() - remindMine * 60 * 1000)
        let month = date.getMonth() + 1
        let day = date.getDate()
        let Hours = date.getHours()
        let Minutes = date.getMinutes()
        let time = `0 ${Minutes} ${Hours} ${day} ${month} *`
        setSchedule("J.", time, remindText)
      })
    })
    .catch(err => {
      console.log(parseTime(new Date().getTime()), err)
      setTimeTableTodo()
    })
}
module.exports = {
  setTodo,
  removeTodo,
  setTimeTableTodo
}
