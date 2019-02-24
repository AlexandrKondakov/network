import { combineReducers } from 'redux'
import { userPageReducer } from './userPage'

export const rootReducer = combineReducers({
  userPage: userPageReducer
})