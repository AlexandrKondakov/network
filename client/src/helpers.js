import { store } from './store/configureStore'
import openSocket from 'socket.io-client'

export const rootUrl = 'http://localhost:5000'

export const socket = openSocket(rootUrl)

export const api = `${rootUrl}/api`

export const appName = 'communicate'

export const spaceNormalize = string => string.trim().replace(/\s+/g, ' ')

export const sendAjax = (path, body = {}, isFormData = false, method = 'POST') => {
  const payload = {
    method,
    body,
    headers: {'Authorization': store.getState().user.token}
  }

  if (!isFormData) {
    payload.body = JSON.stringify(body)
    payload.headers['Content-Type'] = 'application/json'
  }
  return fetch(`${api}/${path}`, payload)
}

export const formatDate = date => {
  const digit = '2-digit'
  try {
    return new Date(date).toLocaleString('ru-RU', {
      year: digit,
      month: digit,
      day: digit,
      hour: digit,
      minute: digit
    })
  }
  catch { return '' }
}

export const sendSocketMessage = (fromId, toId, msg) => { socket.emit('subscribeToMessage', fromId, toId, msg) }

