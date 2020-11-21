const express = require("express");
const log4js = require("log4js");
const utils = require("./utils");
const config = require("./config");
const task = require("./task");
const WebSocket = require("ws"); // 引入模块
const { parseTime } = require("./utils");
const ws = new WebSocket.Server({ port: 3030 }, () => {
  // 监听接口
  console.log("socket start");
});
log4js.configure({
  appenders: { globalError: { type: "file", filename: "./log/error.log" } },
  // 只有错误时error级别才会写入文件
  categories: { default: { appenders: ["globalError"], level: "error" } },
});
const logger = log4js.getLogger("cheese");

global.clients = [];
ws.on("connection", (client) => {
  //console.log("client:",client)
  global.clients.push(client);
  client.on("message", (msg) => {
    console.log("来自服务器的数据", msg);
    client.send(
      JSON.stringify({
        userName: "心肝大宝贝",
        alias: "J.",
        message: "爱你",
        autograph: "生如将逝，爱因本心",
        time: parseTime(new Date()),
        isLogin: true,
        type: "love",
      })
    ); // 通过send方法来给前端发送消息
    //sendall();
  });
  client.on("close", (msg) => {
    console.log("关闭服务器连接");
  });
});
const app = express();
app.use(express.static("views"));
app.set("view engine", "pug");
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (e) {
    logger.error(e);
  }
});

app.get("/temp", (req, res) => {
  const formatedDate = utils.getDate();
  const days = utils.getDay(config.MEET_DAY);
  const date = `${formatedDate} | 相遇的第${days}天`;
  res.render("template", {
    ...global.tempData,
    date,
  });
});

app.listen(4000, async () => {
  console.log("Example app listening on port 4000!");
  task();
});
