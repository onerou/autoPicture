const puppeteer = require("puppeteer");
const { getNewsUser, changeNewsTitle } = require("../utils/MySql");

const pushMessage = async (bot) => {
  setInterval(async () => {
    let userList = await getNewsUser();
    let news = await getNews();
    if (userList.length <= 0) return;
    userList.map((v) => {
      if (v.lastTitle != news.title) {
        botSay(v.user, news);
      }
    });
  }, 60000);
};

const botSay = async (user, news) => {
  let weiba = await bot.Contact.find({
    name: user,
  });
  if (!weiba) {
    weiba = await bot.Contact.find({
      alias: user,
    });
  }
  changeNewsTitle(user, news.title);
  weiba &&
    weiba.say(`标题：${news.title}
	
	描述：${news.dir}

	文章链接：${news.url}
	`);
};

const getNews = async () => {
  let browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
    defaultViewport: {
      width: 1400,
      height: 930,
    },
    headless: true,
  });
  const page = await browser.newPage();
  await page.goto("http://society.people.com.cn/", {
    timeout: 60000, //timeout here is 60 seconds
  });
  let news = await page.evaluate(() => {
    let on = document.querySelector(".headingNews>.hdNews>.on");
    let title = on.querySelector("h5>a").innerText;
    let dir = on.querySelector("em>a").innerText;
    let url = on.querySelector("em>a").href;
    return {
      title,
      dir,
      url,
    };
  });
  browser.close();
  return news;
};

module.exports = pushMessage;
