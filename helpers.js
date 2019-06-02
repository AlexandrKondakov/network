const fs = require('fs')
const path = require('path')

exports.emailRegExp = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/

exports.latinRegExp = /^[A-Za-z0-9]+$/

exports.commonError = 'Ошибка сервера, повторите позднее'

exports.errorResponse = (res, text = exports.commonError) => { res.send({message: text, error: true}) }

exports.getUserId = req => {
  try { return req.headers.referer.split(`${req.headers.origin}/`)[1].split('/')[0] }
  catch(e) { return '' }
}

exports.inputsValidate = (inputs, checkEmpty = true) => {
  let text = ''
  for (let i = 0, len = inputs.length; i < len; i++) {
    if (checkEmpty && !inputs[i]) {
      text = 'Заполните все поля!'
      break
    }
    if (inputs[i].length > 30 ) {
      text = 'Максимальное количество символов не больше 30'
      break
    }
  }
  return text
}

exports.checkAndCreateDirectory = (targetDir, isRelativeToScript = false) => {
  const initDir = path.isAbsolute(targetDir) ? path.sep : ''
  const baseDir = isRelativeToScript ? __dirname : '.'

  return targetDir.split(path.sep).reduce((parentDir, childDir) => {
    const curDir = path.resolve(baseDir, parentDir, childDir)

    try { fs.mkdirSync(curDir) }
    catch (err) {
      if (err.code === 'EEXIST') return curDir
      if (err.code === 'ENOENT') throw new Error(`EACCES: permission denied, mkdir ${parentDir}`)
    }

    return curDir
  }, initDir)
}