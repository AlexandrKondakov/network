const nodeMailer = require('nodemailer')

const sendEmail = (receiver = 'communicate.post@gmail.com', link, title = '', message = '') => {

  const transporter = nodeMailer.createTransport({
    host: 'smtp.mail.ru',
    port: 587,
    auth: {
      user: '',
      pass: ''
    }
  })

  const options = {
    from: '',
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
