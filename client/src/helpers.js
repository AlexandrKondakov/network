export const api = 'http://localhost:5000/api'

export const appName = 'communicate'

export const spaceNormalize = string => string.trim().replace(/\s+/g, ' ')

export const sendAjax = (path, body = {}, isFormData = false, method = 'POST') => {
  const payload = {method, body}

  if (!isFormData) {
    payload.body = JSON.stringify(body)
    payload.headers = {'Content-Type': 'application/json'}
  }
  return fetch(`${api}/${path}`, payload)
}