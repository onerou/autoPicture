const nodemailer = require("nodemailer")
const emailPath = "hecheng@vchangyi.com"

function setEmailer() {
  return nodemailer.createTransport({
    host: "smtp.exmail.qq.com", // 这是腾讯的邮箱 host
    port: 465, // smtp 端口
    secureConnection: true,
    auth: {
      user: emailPath,
      pass: "vuLJKdw6hRALEB5U" // 163邮箱授权密码
    }
  })
}

function sendMail({ to, cont, title }) {
  let transporter = setEmailer()
  var mailOptions = {
    from: emailPath, // 发送邮件的邮箱
    to: to, // 给谁发送
    subject: title, // 右键主题
    text: cont // 右键内容
  }
  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, function(error, info) {
      if (error) {
        console.log(error)
      } else {
        resolve("邮件发送成功")
      }
    })
  })
}
module.exports = function(obj) {
  return sendMail(obj)
}
