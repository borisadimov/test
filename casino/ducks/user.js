import crypto from 'crypto';

import {CLIENT_ID, CLIENT_SECRET, API_ENDPOINT, sendRequest} from '../serverApi';
import {store, math, formatBTC} from '../index';


export const LOGIN_REQUEST              = 'app/users/LOGIN_REQUEST';
export const LOGIN_RESPONSE             = 'app/users/LOGIN_RESPONSE';
export const REGISTER_REQUEST           = 'app/users/REGISTER_REQUEST';
export const REGISTER_RESPONSE          = 'app/users/REGISTER_RESPONSE';
export const GET_INFO_REQUEST           = 'app/users/GET_INFO_REQUEST';
export const GET_INFO_RESPONSE          = 'app/users/GET_INFO_RESPONSE';
export const GET_TRANSACTIONS_REQUEST   = 'app/users/GET_TRANSACTIONS_REQUEST';
export const GET_TRANSACTIONS_RESPONSE  = 'app/users/GET_TRANSACTIONS_RESPONSE';
export const LOCAL_STORAGE_RESPONSE     = 'app/users/LOCAL_STORAGE_RESPONSE';
export const TOKEN_UPDATE               = 'app/users/TOKEN_UPDATE';
export const LOGOUT                     = 'app/users/LOGOUT';
export const CHANGE_INFO_REQUEST        = 'app/users/CHANGE_INFO_REQUEST';
export const CHANGE_INFO_RESPONSE       = 'app/users/CHANGE_INFO_RESPONSE';
export const WITHDRAW_REQUEST           = 'app/users/WITHDRAW_REQUEST';
export const WITHDRAW_RESPONSE          = 'app/users/WITHDRAW_RESPONSE';
export const UPDATE_BALANCE             = 'app/users/UPDATE_BALANCE';

export const ERROR_USER_EXISTS  = 'app/users/ERROR_USER_EXISTS';
export const ERROR_WRONG_PASS   = 'app/users/ERROR_WRONG_PASS';

export const GET_FREESATOSHI_REQUEST    = 'app/users/GET_FREESATOSHI_REQUEST';
export const GET_FREESATOSHI_RESPONSE   = 'app/users/GET_FREESATOSHI_RESPONSE';


function sendAuthRequest(dispatch, type, params) {
  let path = type == LOGIN_RESPONSE ? '/auth/token' : '/auth/register';
  let options = {
    method: 'POST',
    mode: 'cors',
    cache: 'no-cache',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(params)
  };

  let respStatus = 0;

  fetch(API_ENDPOINT + path, options)
    .then(response => {
      respStatus = response.status;
      return response.json();
    })
    .then(res => {
      if (respStatus == 200) {
        let tokens = {
          access:   res['access_token'],
          refresh:  res['refresh_token'],
          expires:  res['expires_in']
        };
        let auth = {
          username: params.username,
          password: params.password,
          tokens
        };
        localStorage.setItem('authorization', JSON.stringify(auth));
        dispatch({
          type,
          authorized: true,
          tokens
        });
      } else if (respStatus == 401 || respStatus == 403) {
        dispatch({
          type,
          authError: ERROR_WRONG_PASS
        });
      } else if (respStatus == 400) {
        dispatch({
          type,
          authError: ERROR_USER_EXISTS
        });
      }
    });
}

export function register(username) {
  return dispatch => {
    //generate random password - then user can change it
    let random = Math.random().toString();
    let password = '' + crypto.createHmac('sha256', random).digest('hex');
    password = password.slice(0, 25);

    dispatch({
      type: REGISTER_REQUEST,
      username,
      password
    });

    let params = {
      username,
      password,
      'client_id': CLIENT_ID
    };

    sendAuthRequest(dispatch, REGISTER_RESPONSE, params);
  };
}

export function login(username, password) {
  return dispatch => {
    dispatch({
      type: LOGIN_REQUEST,
      username,
      password
    });

    let params = {
      username,
      password,
      'client_id': CLIENT_ID,
      'grant_type': 'password',
      'client_secret': CLIENT_SECRET
    };

    sendAuthRequest(dispatch, LOGIN_RESPONSE, params);
  };
}

export function loginOrRegister(username, password) {
  return dispatch => {
    dispatch({
      type: LOGIN_REQUEST,
      username,
      password
    });

    if (!password || !password.length) {
      let random = Math.random().toString();
      password = '' + crypto.createHmac('sha256', random).digest('hex');
      password = password.slice(0, 25);
    }

    let params = {
      username,
      password,
      'client_id': CLIENT_ID,
      'grant_type': 'password',
      'client_secret': CLIENT_SECRET
    };
    let options = {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(params)
    };

    let respStatus = 0;

    fetch(API_ENDPOINT + '/auth/token', options)
      .then(response => {
        respStatus = response.status;
        if (respStatus == 200)
          return response.json();
        else
          return fetch(API_ENDPOINT + '/auth/register', options)
            .then(response => {
              respStatus = response.status;
              return response.json();
            });
      })
      .then(res => {
        if (respStatus == 200) {
          let tokens = {
            access:   res['access_token'],
            refresh:  res['refresh_token'],
            expires:  res['expires_in']
          };
          let auth = {
            username: params.username,
            password: params.password,
            tokens
          };
          localStorage.setItem('authorization', JSON.stringify(auth));

          dispatch({
            type: LOGIN_RESPONSE,
            authorized: true,
            tokens
          });
        } else {
          dispatch({
            type: LOGIN_RESPONSE,
            authError: ERROR_WRONG_PASS
          });
        }
      });
  };
}

export function getLocalStorage() {
  let authStr = localStorage.getItem('authorization');
  if (authStr) {
    let auth = JSON.parse(authStr);
    return {
      type: LOCAL_STORAGE_RESPONSE,
      authorized: true,
      username: auth.username,
      password: auth.password,
      tokens: auth.tokens
    };
  }

  return {
    type: LOCAL_STORAGE_RESPONSE,
    authorized: false
  };
}

let userUpdateInterval = 0;
const USER_UPDATE_INTERVAL = 300;

export function getUserInfo() {
  return dispatch => {
    dispatch({
      type: GET_INFO_REQUEST
    });

    let process = () =>
      sendRequest('/api/user')
        .then(response => response.json())
        .then(res => {
          dispatch({
            type: GET_INFO_RESPONSE,
            info: res
          });
        });

    process();
    if (!userUpdateInterval)
      userUpdateInterval = setInterval(process, USER_UPDATE_INTERVAL * 1000);
  };
}

export function getTransactions() {
  return dispatch => {
    dispatch({
      type: GET_TRANSACTIONS_REQUEST
    });

    let deposits;
    let withdrawals;
    
    sendRequest('/api/deposits')
      .then(response => response.json())
      .then(res => deposits = res.deposits)

      .then(() => sendRequest('/api/withdraws'))
      .then(response => response.json())
      .then(res => withdrawals = res.withdraws)

      .then(() => {
        dispatch({
          type: GET_TRANSACTIONS_RESPONSE,
          deposits,
          withdrawals
        });
      });
  };
}

export function askSatoshi(captcha) {
  return dispatch => {
    dispatch({
      type: GET_FREESATOSHI_REQUEST
    });

    let options = {
      method: 'POST',
      body: JSON.stringify({captcha})
    };

    sendRequest('/api/freesatoshi', options)
      .then(response => {
        if (response.status == 200)
          return response.json();
        else
          return Promise.reject(response);
      })
      .then(res => {
        dispatch({
          type: GET_FREESATOSHI_RESPONSE,
          status: true,
          balance: res.balance
        });
      })
      .catch(() => {
        dispatch({
          type: GET_FREESATOSHI_RESPONSE,
          status: false
        });
      });
  };
}

export function updateToken(srvTokens) {
  let local = JSON.parse(localStorage.getItem('authorization'));
  let tokens = {
    access:   srvTokens['access_token'],
    refresh:  srvTokens['refresh_token'],
    expires:  srvTokens['expires_in']
  };
  local = {...local, tokens};
  localStorage.setItem('authorization', JSON.stringify(local));

  return {
    type: TOKEN_UPDATE,
    tokens
  };
}

export function updateBalance(balance) {
  return {
    type: UPDATE_BALANCE,
    balance: balance
  };
}

export function updateUserInfo(info) {
  return dispatch => {
    dispatch({
      type: CHANGE_INFO_REQUEST,
      info
    });

    let params = {};
    if (info.username && info.username.length)
      params.username = info.username;
    if (info.email && info.email.length)
      params.email = info.email;
    if (info.withdrawAddress && info.withdrawAddress.length)
      params.withdraw_address = info.withdrawAddress;
    if (info.password && info.password.length) {
      params.password = info.password;
      info.isPasswordUpdated = true;
    }

    let options = {
      method: 'PUT',
      body: JSON.stringify(params)
    };
    sendRequest('/api/user', options)
      .then(res => {
        dispatch({
          type: CHANGE_INFO_RESPONSE,
          info
        });
      });
  }
}

export function withdraw(address, amount) {
  return dispatch => {
    dispatch({
      type: WITHDRAW_REQUEST
    });

    let params = {
      address,
      amount: formatBTC(amount)
    };
    let options = {
      method: 'POST',
      body: JSON.stringify(params)
    };

    sendRequest('/api/withdraw', options)
      .then(res => {
        dispatch({
          type: WITHDRAW_RESPONSE
        });
        store.dispatch(getUserInfo());
      });
  };
}

export function logout() {
  localStorage.clear();
  return {
    type: LOGOUT
  };
}


const initialState = {
  authorized: false,
  authError: null,

  username: null,
  password: null,

  tokens: {
    access: null,
    refresh: null,
    expires: null
  },

  id: '',

  email: null,
  withdrawAddress: null,
  depositAddress: null,
  balance: null,
  nonce: 0,
  profit: 0,
  wagered: 0,
  wins: 0,
  isPasswordUpdated: true,

  deposits: [],
  withdrawals: [],

  freeSatoshiError: false
};

export default function userReducer(state = initialState, action) {
  switch (action.type) {

    case LOGIN_REQUEST:
    case REGISTER_REQUEST:
      return {
        ...state,
        authorized: false,
        authError: null,
        username: action.username,
        password: action.password
      };

    case LOGIN_RESPONSE:
    case REGISTER_RESPONSE:
      return {
        ...state,
        authorized: action.authorized,
        authError:  action.authError,
        tokens:     action.tokens
      };

    case LOCAL_STORAGE_RESPONSE:
      if (action.authorized)
        return {
          ...state,
          authorized: true,
          username: action.username,
          password: action.password,
          tokens:   action.tokens
        };
      else
        return state;

    case TOKEN_UPDATE:
      return {
        ...state,
        tokens: action.tokens
      };

    case UPDATE_BALANCE:
      return {
        ...state,
        balance: math.bignumber(action.balance)
      };

    case LOGOUT:
      return {
        ...state,
        authorized: false
      };

    case GET_FREESATOSHI_RESPONSE:
      if (action.status)
        return {
          ...state,
          freeSatoshiError: false,
          balance: math.add(state.balance, math.bignumber(action.balance))
        };
      else
        return {
          ...state,
          freeSatoshiError: true
        };

    case GET_INFO_RESPONSE:
      return {
        ...state,
        id:                 action.info.user_id             !== undefined ? action.info.user_id                 : state.id,
        balance:            action.info.balance             !== undefined ? math.bignumber(action.info.balance) : state.balance,
      //nonce:              action.info.nonce,              !== undefined ? action.info.nonce                   : state.nonce,
      //profit:             action.info.profit,             !== undefined ? action.info.profit                  : state.profit,
      //wagered:            action.info.wagered,            !== undefined ? action.info.wagered                 : state.wagered,
      //wins:               action.info.wins,               !== undefined ? action.info.wins                    : state.wins
        email:              action.info.email               !== undefined ? action.info.email                   : state.email,
      //isPasswordUpdated:  action.info.is_password_updated !== undefined ? action.info.is_password_updated     : state.isPasswordUpdated,
        withdrawAddress:    action.info.withdraw_address    !== undefined ? action.info.withdraw_address        : state.withdrawAddress,
        depositAddress:     action.info.deposit_address     !== undefined ? action.info.deposit_address         : state.depositAddress
      };

    case GET_TRANSACTIONS_RESPONSE:
      return {
        ...state,
        deposits: action.deposits,
        withdrawals: action.withdrawals
      };

    case CHANGE_INFO_RESPONSE:
      return {
        ...state,
        username:           action.info.username,
        password:           action.info.password,
        email:              action.info.email,
        withdrawAddress:    action.info.withdrawAddress,
      //isPasswordUpdated:  action.info.isPasswordUpdated
      };

    case WITHDRAW_RESPONSE:
      return state;

    case GET_INFO_REQUEST:
    case GET_TRANSACTIONS_REQUEST:
    case CHANGE_INFO_REQUEST:
    case WITHDRAW_REQUEST:
    default:
      return state;
  }
}