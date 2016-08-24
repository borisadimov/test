import React, {Component, PropTypes} from 'react';

import {MODAL_SATOSHI, MODAL_DEPOSIT, MODAL_WITHDRAW, MODAL_ALERT_NO_FREE, MODAL_ALERT_NOT_ENOUGH,
  MODAL_ALERT_NO_PROFIT, TRANSACTIONS, MODAL_ALERT_GAME_STOPPED} from '../../ducks/windows';

import Alert from './Alert/Alert';
import Satoshi from './Satoshi/Satoshi';
import Deposit from './Deposit/Deposit';
import Withdraw from './Withdraw/Withdraw';
import Transactions from './Transactions/Transactions';


export default class Modals extends Component {
  render() {
    const {type, askSatoshi, onClose, depositAddress, withdrawAddress, balance, doWithdraw, getTransactions,
      getBalance, deposits, withdrawals} = this.props;

    let Modal = (<span />);
    switch (type) {
      case MODAL_SATOSHI:
        Modal = (<Satoshi onClose={onClose}
                          askSatoshi={askSatoshi} />);
        break;

      case MODAL_DEPOSIT:
        Modal = (<Deposit onClose={onClose}
                          address={depositAddress} />);
        break;

      case MODAL_WITHDRAW:
        Modal = (<Withdraw onClose={onClose}
                           address={withdrawAddress}
                           balance={balance}
                           doWithdraw={doWithdraw} />);
        break;

      case MODAL_ALERT_NO_FREE:
      case MODAL_ALERT_NOT_ENOUGH:
      case MODAL_ALERT_NO_PROFIT:
      case MODAL_ALERT_GAME_STOPPED:
        Modal = (<Alert onClose={onClose} type={type}/>);
        break;

      case TRANSACTIONS:
        Modal = (<Transactions onClose={onClose}
                               type={type}
                               getTransactions={getTransactions}
                               getBalance={getBalance}
                               deposits={deposits}
                               withdrawals={withdrawals} />);
        break;
    }

    return Modal;
  }
}
