import {sendRequest} from '../serverApi';


export const HISTORY_REQUEST  = 'app/chat/HISTORY_REQUEST';
export const HISTORY_RESPONSE = 'app/chat/HISTORY_RESPONSE';
export const MESSAGE_SEND     = 'app/chat/MESSAGE_SEND';

export function getHistory() {
  return dispatch => {
    dispatch({
      type: HISTORY_REQUEST
    });

    sendRequest('/api/messages')
      .then(response => response.json())
      .then(res => {
        dispatch({
          type: HISTORY_RESPONSE,
          history: res.messages
        });
      });
  };
}

export function sendMessage(message) {
  let body = {text: message};
  let options = {
    method: 'POST',
    body: JSON.stringify(body)
  };

  sendRequest('/api/message', options);
  
  return {
    type: MESSAGE_SEND,
    message
  };
}

const initialState = {
  history: []
};

export default function chatReducer(state = initialState, action) {
  switch (action.type) {
    case HISTORY_RESPONSE:
      return {...state, history: action.history};

    case MESSAGE_SEND:
    default:
      return state;
  }
}
