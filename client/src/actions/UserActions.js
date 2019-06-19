export const SET_IS_LOGGED_IN = 'SET_IS_LOGGED_IN'
export const SET_USER_NAME = 'SET_USER_NAME'
export const SET_TOKEN = 'SET_TOKEN'
export const SET_ID = 'SET_ID'
export const SET_AVATAR_LINK = 'SET_AVATAR_LINK'
export const SET_CONTACTS = 'SET_CONTACTS'
export const ADD_CONTACT = 'ADD_CONTACT'
export const REMOVE_CONTACT = 'REMOVE_CONTACT'

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

export function setAvatarLink(link) {
  return {
    type: SET_AVATAR_LINK,
    payload: link,
  }
}

export function setContacts(contacts) {
  return {
    type: SET_CONTACTS,
    payload: contacts,
  }
}

export function addContact(contact) {
  return {
    type: ADD_CONTACT,
    payload: contact,
  }
}

export function removeContact(contact) {
  return {
    type: REMOVE_CONTACT,
    payload: contact,
  }
}
