import io from 'socket.io-client';

import {sendRequest, API_ENDPOINT} from '../serverApi';
import {LOGIN_RESPONSE, REGISTER_RESPONSE, LOCAL_STORAGE_RESPONSE} from '../ducks/user';
import {socketsInit} from '../ducks/sockets';


export const sockets = store => next => action => {
  if ((action.type == REGISTER_RESPONSE || action.type == LOGIN_RESPONSE || LOCAL_STORAGE_RESPONSE) &&
      action.authorized) {
    let socket = io(API_ENDPOINT, {path: '/ws'});
    next(socketsInit(socket));
  }
  
  next(action);
};
