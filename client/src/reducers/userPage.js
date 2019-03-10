import { SET_ISLOGGEDIN, SET_USERDATA } from '../actions/UserPageActions'

const initialState = {
  isLoggedIn: false,
  userData: null
}

export function userPageReducer(state = initialState, action) {

  switch (action.type) {
    case SET_ISLOGGEDIN:
      return { ...state, isLoggedIn: action.payload }
    case SET_USERDATA:
      return { ...state, userData: action.payload }

    default:
      return state
  }
}	