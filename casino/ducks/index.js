import {combineReducers} from 'redux';
import windows from './windows';
import user from './user';
import sockets from './sockets';
import chat from './chat';
import bets from './bets';


export default combineReducers({
  windows,
  user,
  sockets,
  chat,
  bets
});