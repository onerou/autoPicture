const notifier = require("node-notifier");
const { parseTime } = require("./index.js");
const path = require("path");
// var cmd = require("node-cmd")
const notifierFn = ({ title, message = "" }) => {
  notifier.notify(
    {
      title,
      message,
      icon: path.join(__dirname, "favicon.ico"), // Absolute path (doesn't work on balloons)
      sound: true, // Only Notification Center or Windows Toasters
      wait: true, // Wait with callback, until user action is taken against notification
    },
    function (err, response) {
      // Response is response from notification
      if (err) {
        errLog(err);
        errLog(response);
      }
    }
  );
};

const errLog = (err) => {
  console.log(
    "现在是\n",
    parseTime(new Date().getTime(), "{y}-{m}-{d}  {h}:{i}:{s}")
  );
  console.log("错误：\n", err);
  logger.error(
    utils.parseTime(new Date().getTime(), "{y}-{m}-{d}  {h}:{i}:{s}") + err
  );
};
// notifier.on('click', function (notifierObject, options) {
//   cmd.run('start "C:Program Files (x86)GoogleChromeApplicationchrome.exe" http://ace.piesat.cn/main.xhtml');
// });
// notifierFn()
module.exports = notifierFn;
