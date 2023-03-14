import nodemailer from 'nodemailer'

// create reusable transporter object using SMTP transport
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_TSL,
  auth: {
    user: process.env.SMTP_USERNAME,
    pass: process.env.SMTP_PASSWORD,
  },
})

export function sendMail(toMail: string, verifyUrl: string) {
  const mailOptions = {
    from: process.env.SMTP_USERNAME, // sender address
    to: toMail, // list of receivers
    subject: '账号验证', // Subject line
    // text: 'Hello world?', // plain text body
    html: `<h1>你正在注册网站，你的邮箱验证链接为（12小时内有效）</h1><br/><br/><a target="_blank" href="${verifyUrl}">点我验证</a>`, // html body
  }

  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
    if (error)
      throw error
    else
      return info.messageId
  })
}
