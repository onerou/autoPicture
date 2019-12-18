const express = require("express")
const utils = require("./utils")
const config = require("./config")
const task = require("./task")
const WebSocket = require("ws") // 引入模块
const { parseTime } = require("./utils")
const ws = new WebSocket.Server({ port: 3000 }, () => {
  // 监听接口
  console.log("socket start")
})
global.clients = []
ws.on("connection", client => {
  //console.log("client:",client)
  global.clients.push(client)
  client.on("message", msg => {
    console.log("来自服务器的数据", msg)
    client.send(
      JSON.stringify({
        userName: "心肝大宝贝",
        alias: "J.",
        message: "爱你",
        autograph: "生如将逝，爱因本心",
        time: parseTime(new Date()),
        isLogin: true,
        type: "love"
      })
    ) // 通过send方法来给前端发送消息
    //sendall();
  })
  client.on("close", msg => {
    console.log("关闭服务器连接")
  })
})
const app = express()
app.use(express.static("views"))
app.set("view engine", "pug")

app.get("/temp", (req, res) => {
  const formatedDate = utils.getDate()
  const days = utils.getDay(config.MEET_DAY)
  const date = `${formatedDate} | 相遇的第${days}天`
  res.render("template", {
    ...global.tempData,
    date
  })
})

app.listen(4000, async () => {
  console.log("Example app listening on port 4000!")
  task()
})
