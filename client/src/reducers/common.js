import { SET_PRELOADER } from '../actions/CommonActions'

const initialState = {
  preloader: false,
}

export function commonReducer(state = initialState, action) {
  switch (action.type) {
    case SET_PRELOADER:
      return { ...state, preloader: action.payload }

    default:
      return state
  }
}	