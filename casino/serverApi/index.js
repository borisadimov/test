import {store} from '../index';
import {updateToken, logout} from '../ducks/user';

export const CLIENT_ID = 'mobileV1';
export const CLIENT_SECRET = 'abc123456';
export const API_ENDPOINT =
  process.env.NODE_ENV === 'development' ?
    'http://localhost:3000' :
    'https://bitcoinzebra.com';

export let tokenDate = new Date();

export function init() {
  tokenDate = new Date();
}

export function getRequestOptions() {
  let res = {
    method: 'GET',
    mode: 'cors',
    cache: 'no-cache',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + store.getState().user.tokens.access
    }
  };
  return res;
}

let waiting = false;
let timeouts = [];

export function sendRequest(url, newOptions = {}) {
  let refreshToken = () => {
    if (waiting)
      return new Promise(resolve => timeouts.push(setTimeout(resolve, 1000)))
        .then(() => sendRequest(url, newOptions));

    waiting = true;

    let params = {
      'grant_type': 'refresh_token',
      'client_id': CLIENT_ID,
      'client_secret': CLIENT_SECRET,
      'refresh_token': store.getState().user.tokens.refresh
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

    return fetch(API_ENDPOINT + '/auth/token', options)
      .then(response => {
        if (response.status == 200) {
          return response.json();
        } else {
          for (let timeout of timeouts) {
            clearTimeout(timeout);
          }
          timeouts = [];
          store.dispatch(logout());
          return Promise.reject();
        }
      })
      .then(res => store.dispatch(updateToken(res)))
      .then(() => {
        waiting = false;
        return sendRequest(url, newOptions);
      });
  };


  let options = getRequestOptions();
  Object.assign(options, newOptions);

  let now = new Date();
  let expires = store.getState().user.tokens.expires;
  if (!expires || now - tokenDate < expires * 1000) {
    return fetch(API_ENDPOINT + url, options)
      .then(response => {
        if (response.status == 401)
          return refreshToken();
        return response;
      });
  } else {
    return refreshToken();
  }
}
