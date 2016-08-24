import {sendRequest} from '../serverApi';
import {store, math, formatBTC} from '../index';

import {GET_INFO_RESPONSE} from "ducks/user";
import {openModal, MODAL_ALERT_NOT_ENOUGH, MODAL_ALERT_NO_PROFIT} from "./windows";


export const BETS_HISTORY_REQUEST   = 'app/bets/BETS_HISTORY_REQUEST';
export const BETS_HISTORY_RESPONSE  = 'app/bets/BETS_HISTORY_RESPONSE';
export const UPDATE_BET             = 'app/bets/UPDATE_BET';
export const BET_REQUEST            = 'app/bets/BET_REQUEST';
export const BET_REQUEST_ERROR      = 'app/bets/BET_REQUEST_ERROR';
export const BET_RESPONSE           = 'app/bets/BET_RESPONSE';
export const ANIMATION_FINISH       = 'app/bets/ANIMATION_FINISH';

export const TAB_USER     = 'app/bets/others/TAB_USER';
export const TAB_LAST_30  = 'app/bets/others/TAB_LAST_30';
export const TAB_TOP_30   = 'app/bets/others/TAB_TOP_30';

export function getBetsHistory() {
  return dispatch => {
    dispatch({
      type: BETS_HISTORY_REQUEST
    });

    let betsUser = [];
    let betsLast30 = [];
    let betsTop30 = [];

    sendRequest('/api/mybets')
      .then(response => response.json())
      .then(res => betsUser = res.bets)

      .then(() => sendRequest('/api/bets'))
      .then(response => response.json())
      .then(res => betsLast30 = res.bets)

      .then(() => sendRequest('/api/top_bets'))
      .then(response => response.json())
      .then(res => {
        betsTop30 = res.bets;
        dispatch({
          type: BETS_HISTORY_RESPONSE,
          betsUser,
          betsLast30,
          betsTop30
        });
      })
  };
}

export function updateBet(bet, allow) {
  return {
    type: UPDATE_BET,
    bet,
    allow
  };
}

export function sendBet() {
  return dispatch => {
    dispatch({type: BET_REQUEST});

    if (!store.getState().bets.allow) {
      store.dispatch(openModal(MODAL_ALERT_NO_PROFIT));
      dispatch({type: BET_REQUEST_ERROR});
      return;
    }

    if (math.larger(store.getState().bets.bet.amount, store.getState().user.balance)) {
      store.dispatch(openModal(MODAL_ALERT_NOT_ENOUGH));
      dispatch({type: BET_REQUEST_ERROR});
      return;
    }

    let bet = {
      target: store.getState().bets.bet.target,
      condition: store.getState().bets.bet.condition,
      amount: formatBTC(store.getState().bets.bet.amount)
    };

    let options = {
      method: 'POST',
      body: JSON.stringify(bet)
    };
    sendRequest('/api/bet', options)
      .then(res => res.json())
      .then(res => {
        dispatch({
          type: BET_RESPONSE,
          bet: res.bet
        });

        dispatch({
          type: GET_INFO_RESPONSE,
          info: res.user
        });
      })
      .catch(err => dispatch({type: BET_REQUEST_ERROR}));
  };
}

export function betResponse(bet) {
  return {
    type: BET_RESPONSE,
    bet
  }
}

export function finishAnimation() {
  return {
    type: ANIMATION_FINISH
  };
}


const initialState = {
  betsUser: [],
  betsLast30: [],
  betsTop30: [],

  bet: null,
  lastResult: undefined,
  randomValue: 0,
  ready: false,
  fetching: false, 
  
  allow: true
};

export default function betsReducer(state = initialState, action) {
  switch (action.type) {
    case BETS_HISTORY_RESPONSE:
      return {
        ...state, 
        betsUser:   action.betsUser,
        betsLast30: action.betsLast30,
        betsTop30:  action.betsTop30
      };

    case UPDATE_BET:
      return {...state, bet: action.bet, allow: action.allow};

    case BET_REQUEST:
      return { ...state, fetching: true, ready: false};

    case BET_REQUEST_ERROR:
      return { ...state, fetching: false, ready: true};

    case BET_RESPONSE:
      return {
        ...state,
        ready: true,
        randomValue: action.bet.roll,
        lastResult: action.bet.win
      };
    
    case ANIMATION_FINISH:
      return { ...state, fetching: false};

    case BETS_HISTORY_REQUEST:
    default:
      return state;
  }
}
