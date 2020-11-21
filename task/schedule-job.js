const schedule = require("node-schedule");
const config = require("../config");
const utils = require("../utils");
const shell = require("shelljs");
const doPicture = require("./doPicture");

/**
 * 开始定时任务
 * @param {Objcet} bot 微信机器人
 */
async function startScheduleJob(bot) {
  // 每日天气

  schedule.scheduleJob(config.GETUP_TIME, async () => {
    try {
      let weiba = await bot.Contact.find({
        name: config.realName,
      });
      if (!weiba) {
        weiba = await bot.Contact.find({
          alias: config.ALIAS,
        });
      }
      doPicture(weiba);
    } catch (err) {
      console.log(
        "现在是\n",
        utils.parseTime(new Date().getTime(), "{y}-{m}-{d}  {h}:{i}:{s}")
      );
      console.log("错误：\n", err);
      logger.error(
        utils.parseTime(new Date().getTime(), "{y}-{m}-{d}  {h}:{i}:{s}") + err
      );
    }
  });

  // 喝水提醒
  const drinks = config.DRINK_TIME;
  for (let drink of drinks) {
    // let rule = new schedule.RecurrenceRule()
    // let timeArr = drink.time.split(" ")
    // rule.dayOfWeek = [0, new schedule.Range(1, 4)]
    // rule.hour = timeArr[1]
    // rule.minute = timeArr[0]
    schedule.scheduleJob(drink.time, async () => {
      try {
        let people = await bot.Contact.find({
          name: config.realName,
        });
        if (!people) {
          people = await bot.Contact.find({
            alias: config.ALIAS,
          });
        }
        people.say(drink.words);
      } catch (err) {
        console.log(
          "现在是\n",
          utils.parseTime(new Date().getTime(), "{y}-{m}-{d}  {h}:{i}:{s}")
        );
        console.log("错误：\n", err);
        logger.error(
          utils.parseTime(new Date().getTime(), "{y}-{m}-{d}  {h}:{i}:{s}") +
            err
        );
      }
    });
  }
  schedule.scheduleJob("0 0 1 * * *", () => {
    shell.exec("pm2 reload all");
  });
}

module.exports = startScheduleJob;
