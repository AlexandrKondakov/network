export const SET_IS_LOGGED_IN = 'SET_IS_LOGGED_IN'
export const SET_USER_NAME = 'SET_USER_NAME'
export const SET_TOKEN = 'SET_TOKEN'
export const SET_ID = 'SET_ID'

export function setIsLoggedIn(isLoggedIn) {
  return {
    type: SET_IS_LOGGED_IN,
    payload: isLoggedIn,
  }
}

export function setUserName(userName) {
  return {
    type: SET_USER_NAME,
    payload: userName,
  }
}

export function setToken(token) {
  return {
    type: SET_TOKEN,
    payload: token,
  }
}

export function setId(id) {
  return {
    type: SET_ID,
    payload: id,
  }
}