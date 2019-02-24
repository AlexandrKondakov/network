import { SET_NAME } from '../actions/UserPageActions'

const initialState = {
  name: 'Аноним',
}

export function userPageReducer(state = initialState, action) {
  switch (action.type) {
    case SET_NAME:
      return { ...state, name: action.payload }

    default:
      return state
  }
}	