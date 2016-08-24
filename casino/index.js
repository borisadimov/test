import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import App from './containers/app';
import configureStore from './store/configureStore';
import {init as apiInit} from './serverApi';
import {BITCOIN, MAX_DIGITS_BTC, MAX_DIGITS_MBTC} from './models/btc';

import './styles.global.sss';

export let math = require('mathjs');


math.config({
  number: 'BigNumber',
  precision: 64
});

export function formatBTC(num) {
  return math.format(
    num,
    {notation: 'fixed', precision: MAX_DIGITS_BTC}
  );
}

export function formatMBTC(num) {
  return math.format(
    math.multiply(num, BITCOIN),
    {notation: 'fixed', precision: MAX_DIGITS_MBTC}
  );
}

apiInit();
export const store = configureStore();

ReactDOM.render(
  <Provider store={store}>
    <div className='app'>
      <App />
    </div>
  </Provider>,
  document.getElementById('app-root')
);