import { combineReducers } from 'redux';
import counter from './counter';
import messages from './messages';

const rootReducer = combineReducers({
  counter,
  messages,
})

export default rootReducer
