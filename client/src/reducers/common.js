import { SET_PRELOADER } from '../actions/CommonActions'
import { SET_INFORMER } from '../actions/CommonActions'

const initialState = {
  preloader: false,
  informer: {
    text: '',
    isError: true,
  },
}

export function commonReducer(state = initialState, action) {
  switch (action.type) {
    case SET_PRELOADER:
      return { ...state, preloader: action.payload }

    case SET_INFORMER:
      return { ...state, informer: action.payload }

    default: return state
  }
}	