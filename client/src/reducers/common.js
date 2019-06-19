import { SET_INFORMER, SET_CONTACTS_LOADING_STATE } from '../actions/CommonActions'

const initialState = {
  informer: {
    text: '',
    isError: true,
  },
  contactsIsLoading: true,
}

export function commonReducer(state = initialState, action) {
  switch (action.type) {
    case SET_INFORMER:
      return { ...state, informer: action.payload }

    case SET_CONTACTS_LOADING_STATE:
      return { ...state, contactsIsLoading: action.payload }

    default: return state
  }
}	