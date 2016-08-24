import React, {Component, PropTypes} from 'react';
import CSSModules from 'react-css-modules';

import styles from './Header.sss';
import {MODAL_SATOSHI, MODAL_DEPOSIT, MODAL_WITHDRAW, PANEL_SETTINGS, TRANSACTIONS} from 'ducks/windows';
import {BITCOIN, MAX_DIGITS_MBTC} from 'models/btc';
import {formatMBTC} from '../../../index';


@CSSModules(styles, {allowMultiple: true})
export default class Header extends Component  {
  state = {
    fetching: false,
    balance: '0'
  };

  componentWillReceiveProps(nextProps) {
    this.setState({fetching: nextProps.fetching});
    if (!nextProps.fetching)
      this.setState({balance: formatMBTC(nextProps.balance)});
  }

  render() {
    const {openModal, openPanel, changeChatVis} = this.props;

    return (
      <div styleName="header">
        <div styleName="nav">
          <img src={require('./Logo.png')}/>
          <div styleName="nav-item" onClick={() => openModal(TRANSACTIONS)}>Transactions</div>
          <div styleName="nav-item" onClick={() => openPanel(PANEL_SETTINGS)}>Settings</div>
        </div>
        <div styleName="options">
          <div styleName="options-left">
            <div styleName="balance">{this.state.balance} mB</div>
            <div styleName="button free-satoshi">
              <div styleName="button-inner" onClick={() => openModal(MODAL_SATOSHI)}>FREE SATOSHI</div>
            </div>

            <div styleName="button">
              <div styleName="button-inner" onClick={() => openModal(MODAL_DEPOSIT)}>DEPOSIT</div>
            </div>

            <div styleName="button withdraw">
              <div styleName="button-inner" onClick={() => openModal(MODAL_WITHDRAW)}>WITHDRAW</div>
            </div>

            <div styleName="button chat">
              <div styleName="button-inner" onClick={() => changeChatVis(true)}>chat</div>
            </div>
          </div>
        </div>
      </div>
      );
    }
  }
