exports.emailRegExp = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/

exports.latinRegExp = /^[A-Za-z0-9]+$/

exports.commonError = 'Ошибка сервера, повторите позднее'

exports.errorResponse = (res, text = exports.commonError) => { res.send({message: text, error: true}) }