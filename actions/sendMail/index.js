const nodeMailer = require('nodemailer')

const sendEmail = (receiver = 'communicate.post@gmail.com', link, title = '', message = '') => {

  const transporter = nodeMailer.createTransport({
    host: 'smtp.mail.ru',
    port: 587,
    auth: {
      user: 'sergtankian@mail.ru',
      pass: ''
    }
  })

  const options = {
    from: 'sergtankian@mail.ru',
    to: receiver,
    subject: title
  }

  if (link) {
    options.html = `Для подтверждения регистрации на сайте <b>communicate</b> перейдите по ссылке <a href=${link} target="_blank">${link}</a>`
  }
  else options.text = message

  return transporter.sendMail(options)
}

module.exports = sendEmail
