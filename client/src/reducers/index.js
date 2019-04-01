import { combineReducers } from 'redux'
import { userReducer } from './user'
import { commonReducer } from './common'

export const rootReducer = combineReducers({
  user: userReducer,
  common: commonReducer,
})