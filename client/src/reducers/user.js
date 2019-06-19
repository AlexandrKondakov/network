import {
  SET_IS_LOGGED_IN,
  SET_USER_NAME,
  SET_TOKEN,
  SET_ID,
  SET_AVATAR_LINK,
  SET_CONTACTS,
  ADD_CONTACT,
  REMOVE_CONTACT
} from '../actions/UserActions'

const initialState = {
  isLoggedIn: false,
  token: '',
  name: '',
  id: '',
  avatarLink: '',
  contacts: []
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

    case ADD_CONTACT:
      state.contacts.push(action.payload)
      return { ...state }

    case REMOVE_CONTACT:
      const contact = state.contacts.find(contact => contact.id === action.payload)
      if (contact) state.contacts.splice(state.contacts.indexOf(contact), 1)
      return { ...state }

    default: return state
  }
}	