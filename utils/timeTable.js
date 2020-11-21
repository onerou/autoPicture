const puppeteer = require("puppeteer");

const awaitminus = (time) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, time);
  });
};

const goFn = async () => {
  process.on("unhandledRejection", (reason, p) => {
    console.log("Unhandled Rejection at: Promise", p, "reason:", reason);
    // application specific logging, throwing an error, or other logic here
  });
  global.browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
    defaultViewport: {
      width: 1400,
      height: 930,
    },
    // devtools: true,
    // headless: false
    headless: true,
  });
  const login = await browser.newPage();
  await login.goto(
    "http://ids.zuel.edu.cn/authserver/login?service=http%3A%2F%2F202.114.234.75%2Fjsxsd%2F%3Bjsessionid%3DCCE17259627AF4E58F6DF0BA4C0E1B8E",
    {
      timeout: 60000, //timeout here is 60 seconds
    }
  );
  return new Promise(async (resolve) => {
    var evalVar = {
      username: "201943040221",
      password: "06050586yjtt",
    };
    login.evaluate(({ username, password }) => {
      document.querySelector("#username").value = username;
      document.querySelector("#password").value = password;
      document.querySelector(".auth_login_btn ").click();
    }, evalVar);
    setTimeout(() => {
      jumpToMy().then((result) => {
        resolve(result);
      });
    }, 30000);
  });
};
const jumpToMy = async () => {
  const my = await global.browser.newPage();
  await my.goto("http://202.114.234.161/jsxsd/framework/xsMain.jsp", {
    timeout: 60000, //timeout here is 60 seconds
  });
  return new Promise(async (resolve) => {
    my.evaluate(async () => {
      let row = 5;
      let corses = [];
      for (let index = 1; index <= row; index++) {
        let id = `${
          new Date().getDay() == 0 ? 7 : new Date().getDay()
        }_${index}`;
        let divById = document.getElementById(id);
        let spanDom = divById
          ? divById.querySelector("span")
          : document.querySelector(id + " span");
        let info = null;
        if (spanDom) {
          spanDom.click();
          await new Promise((resolve) => {
            setTimeout(() => {
              resolve();
            }, 1000);
          });
          let fraction = document.getElementById("xf").innerHTML;
          let teacher = document.getElementById("skjs").innerHTML;
          let room = document.getElementById("jsmc").innerHTML;
          let number = document.getElementById("kkzc").innerHTML;
          let other = document.getElementById("bz").innerHTML;
          let studyNumber = document.getElementById("kcjd").innerHTML;
          let text = spanDom.innerHTML;
          info = {
            fraction,
            teacher,
            room,
            number,
            other,
            text,
            studyNumber,
          };
        }
        corses.push(info);
      }
      return corses;
    })
      .then((res) => {
        global.browser.close();
        resolve(res);
      })
      .catch(console.log);
  });
};

//async function test() {
// let testArr = await goFn()
// console.log("TCL: test -> testArr", testArr)
//}
//test()
module.exports = goFn;
