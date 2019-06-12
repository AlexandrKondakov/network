import {
  SET_IS_LOGGED_IN,
  SET_USER_NAME,
  SET_TOKEN,
  SET_ID,
  SET_AVATAR_LINK,
  SET_CONTACTS
} from '../actions/UserActions'

const initialState = {
  isLoggedIn: false,
  token: '',
  name: '',
  id: '',
  avatarLink: '',
  contacts: [],
  needUpdateContacts: true,
}

export function userReducer(state = initialState, action) {
  switch (action.type) {
    case SET_IS_LOGGED_IN:
      return action.payload ? { ...state, isLoggedIn: true } : initialState

    case SET_USER_NAME:
      return { ...state, name: action.payload }

    case SET_TOKEN:
      return { ...state, token: action.payload }

    case SET_ID:
      return { ...state, id: action.payload }

    case SET_AVATAR_LINK:
      return { ...state, avatarLink: action.payload }

    case SET_CONTACTS:
      return { ...state, contacts: action.payload }

    default: return state
  }
}	