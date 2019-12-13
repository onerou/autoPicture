const express = require("express")
const utils = require("./utils")
const config = require("./config")
const task = require("./task")

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
