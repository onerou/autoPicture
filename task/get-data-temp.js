const path = require("path");
const puppeteer = require("puppeteer");
const config = require("../config");
const { parseTime } = require("../utils");

async function getTemplate(
  weaTemp,
  weaImg,
  weaStatus,
  weaTips,
  oneImg,
  oneWords
) {
  const browser = await puppeteer.launch({
    args: ["--no-sandbox"],
    defaultViewport: {
      width: 375,
      height: 667,
    },
  });
  const page = await browser.newPage();
  await page.goto(config.TEP_HOST);
  await page.screenshot({
    path: path.join(
      parseTime(+new Date().getTime(), "{y}{m}{d}") + config.TEP_PIC_NAME
    ),
  });
  await browser.close();
}

module.exports = getTemplate;
