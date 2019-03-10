export const SET_ISLOGGEDIN = 'SET_ISLOGGEDIN'
export const SET_USERDATA = 'SET_USERDATA'

export function setIsLoggedIn(isLoggedIn) {
  return {
    type: SET_ISLOGGEDIN,
    payload: isLoggedIn,
  }
}

export function setUserData(userData) {
  return {
    type: SET_USERDATA,
    payload: userData,
  }
}