import {store, math} from '../index';


export const OPEN_MODAL     = 'app/windows/OPEN_MODAL';
export const CLOSE_MODAL    = 'app/windows/CLOSE_MODAL';

export const MODAL_SATOSHI  = 'MODAL_SATOSHI';
export const MODAL_DEPOSIT  = 'MODAL_DEPOSIT';
export const MODAL_WITHDRAW = 'MODAL_WITHDRAW';
export const MODAL_ALERT_NO_FREE    = 'MODAL_ALERT_NO_FREE';
export const MODAL_ALERT_NOT_ENOUGH = 'MODAL_ALERT_NOT_ENOUGH';
export const MODAL_ALERT_NO_PROFIT  = 'MODAL_ALERT_NO_PROFIT';
export const MODAL_ALERT_GAME_STOPPED  = 'MODAL_ALERT_GAME_STOPPED';


export const CHAT_VISIBLE   = 'app/windows/SHOWING_CHAT';

export const OPEN_PANEL     = 'app/windows/OPEN_PANEL';
export const CLOSE_PANEL    = 'app/windows/CLOSE_PANEL';

export const PANEL_SETTINGS = 'PANEL_SETTINGS';
export const TRANSACTIONS = 'TRANSACTIONS';



export function satoshiAvail() {
  //return true;
  return math.smallerEq(store.getState().user.balance, 0);
}

export function openModal(modalType) {
  return {
    type: OPEN_MODAL,
    modalType
  };
}

export function closeModal() {
  return {
    type: CLOSE_MODAL
  };
}

export function changeChatVis(status) {
  return {
    type: CHAT_VISIBLE,
    status
  };
}

export function openPanel(panelType) {
  return {
    type: OPEN_PANEL,
    panelType
  };
}

export function closePanel() {
  return {
    type: CLOSE_PANEL
  };
}

const initialState = {
  // openedModal: MODAL_ALERT_GAME_STOPPED,
  openedModal: null,
  openedPanel: null,
  chatIsVisible: false
};

export default function windowsReducer(state = initialState, action) {
  switch (action.type) {
    case OPEN_MODAL:
      if (action.modalType == MODAL_SATOSHI && !satoshiAvail())
        return { ...state, openedModal: MODAL_ALERT_NO_FREE };
      else
        return { ...state, openedModal: action.modalType };

    case CLOSE_MODAL:
      return { ...state, openedModal: null };

    case CHAT_VISIBLE:
      return { ...state, chatIsVisible: action.status };

    case OPEN_PANEL:
      return { ...state, openedPanel: action.panelType };

    case CLOSE_PANEL:
      return { ...state, openedPanel: null };

    default:
      return state;
  }
}
