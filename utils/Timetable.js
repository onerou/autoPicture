const puppeteer = require("puppeteer")

const awaitminus = time => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve()
    }, time)
  })
}

const goFn = async () => {
  process.on("unhandledRejection", (reason, p) => {
    console.log("Unhandled Rejection at: Promise", p, "reason:", reason)
    // application specific logging, throwing an error, or other logic here
  })
  global.browser = await puppeteer.launch({
    defaultViewport: {
      width: 1400,
      height: 930
    },
    // devtools: true,
     headless: false
   // headless: true
  })
  const login = await browser.newPage()
  await login.goto("http://202.114.234.143/authserver/login", {
    timeout: 60000 //timeout here is 60 seconds
  })
  return new Promise(async resolve => {
    var evalVar = {
      username: "201943040221",
      password: "06050586yjtt"
    }
    await login.evaluate(({ username, password }) => {
      document.querySelector("#username").value = username
      document.querySelector("#password").value = password
      document.getElementById("submitBtn").click()
    }, evalVar)
    setTimeout(async () => {
      let answer = await jumpToMy()
      resolve(answer)
    })
  })
}
const jumpToMy = async () => {
  const my = await global.browser.newPage()
  await my.goto("http://202.114.234.161/jsxsd/framework/xsMain.jsp", {
    timeout: 60000 //timeout here is 60 seconds
  })
  return new Promise(async resolve => {
    let corseArr = await my.evaluate(async () => {
      let row = 5
      let corses = []
      for (let index = 1; index <= row; index++) {
        let id = `${
          new Date().getDay() == 0 ? 7 : new Date().getDay()
        }_${index}`
        let divById = document.getElementById(id)
        let spanDom = divById.querySelector("span")
        let info = null
        if (spanDom) {
          spanDom.click()
          await new Promise((resolve, reject) => {
            setTimeout(() => {
              resolve()
            }, 1500)
          })
          let fraction = document.getElementById("xf").innerHTML
          let teacher = document.getElementById("skjs").innerHTML
          let room = document.getElementById("jsmc").innerHTML
          let number = document.getElementById("kkzc").innerHTML
          let other = document.getElementById("bz").innerHTML
          let studyNumber = document.getElementById("kcjd").innerHTML
          let text = spanDom.innerHTML
          info = {
            fraction,
            teacher,
            room,
            number,
            other,
            text,
            studyNumber
          }
        }
        corses.push(info)
      }
      return corses
    })
    await global.browser.close()
    setTimeout(() => {
      resolve(corseArr)
    })
  })
}

 //async function test() {
  // let testArr = await goFn()
  // console.log("TCL: test -> testArr", testArr)
 //}
 //test()
module.exports = goFn
