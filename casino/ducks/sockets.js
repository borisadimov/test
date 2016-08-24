export const SOCKETS_INIT  = 'app/sockets/SOCKETS_INIT';

export function socketsInit(socket) {
  return {
    type: SOCKETS_INIT,
    socket
  };
}

const initialState = {
  socket: null
};

export default function socketsReducer(state = initialState, action) {
  switch (action.type) {
    case SOCKETS_INIT:
      return {...state, socket: action.socket};
    default:
      return state;
  }
}