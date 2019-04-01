import { SET_IS_LOGGED_IN, SET_USER_NAME, SET_TOKEN, SET_ID } from '../actions/UserActions'

const initialState = {
  isLoggedIn: false,
  token: '',
  name: '',
  id: '',
}

export function userReducer(state = initialState, action) {
  switch (action.type) {
    case SET_IS_LOGGED_IN:
      return { ...state, isLoggedIn: action.payload }
    case SET_USER_NAME:
      return { ...state, name: action.payload }
    case SET_TOKEN:
      return { ...state, token: action.payload }
    case SET_ID:
      return { ...state, id: action.payload }

    default:
      return state
  }
}	