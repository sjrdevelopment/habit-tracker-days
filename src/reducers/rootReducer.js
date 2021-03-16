import { combineReducers } from 'redux'
import trackerData from './trackerData.js'
import config from './config.js'

export default combineReducers({
  trackerData,
  config,
})
