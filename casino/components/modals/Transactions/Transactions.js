import React, {Component, PropTypes} from 'react';
import CSSModules from 'react-css-modules';

import styles from './Transactions.sss';
import {math, formatMBTC} from '../../../index';
import {CONFIRMATIONS} from '../../../models/btc';

export const TAB_DEPOSITS     = 'TAB_DEPOSITS';
export const TAB_WITHDRAWALS  = 'TAB_WITHDRAWALS';


@CSSModules(styles, {allowMultiple: true})
export default class Transactions extends Component {
  state = {
    activeTab: TAB_DEPOSITS
  };

  onChangeTab(activeTab) {
    this.setState({activeTab});
  }

  componentDidMount() {
    const {getTransactions, getBalance} = this.props;
    getTransactions();
    getBalance();
  }

  render() {
    const {onClose, deposits, withdrawals} = this.props;

    let Content;
    let styleDep  = 'button';
    let styleWith = 'button';

    let dateOptions = {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    };
    let locale = navigator.language || navigator.userLanguage;

    switch (this.state.activeTab) {
      case TAB_DEPOSITS:
        if (deposits.length)
          Content = deposits.map(deposit => {
            let amount = math.abs(math.bignumber(deposit.amount));
            let amountStr = formatMBTC(amount) + ' mB';
            let date = new Date(deposit.time * 1000);
            let dateStr = date.toLocaleString(locale, dateOptions);

            let statusClass = "table-td";
            let statusStr = '';
            if (deposit.confirmations === undefined) {
              statusClass += " success";
              statusStr = 'OK';
            } else if (deposit.confirmations >= CONFIRMATIONS) {
              statusClass += " success";
              statusStr = deposit.confirmations;
            } else {
              statusClass += " error";
              statusStr = deposit.confirmations;
            }

            return (
              <div styleName="table-listItem" key={deposit.txid || Math.random()}>
                <div styleName="table-td table-date">{dateStr}</div>
                <div styleName="table-td table-id">{deposit.txid}</div>
                <div styleName="table-td table-type">{deposit.type}</div>
                <div styleName={statusClass}>{statusStr}</div>
                <div styleName="table-td">{amountStr}</div>
              </div>
            );
          });
        else
          Content = (
            <div styleName="empty">Empty</div>
          );

        styleDep  += ' button-active';
        break;

      case TAB_WITHDRAWALS:
        if (withdrawals.length)
          Content = withdrawals.map(withdraw => {
            let amount = math.abs(math.bignumber(withdraw.amount));
            let amountStr = formatMBTC(amount) + ' mB';
            let date = new Date(withdraw.time);
            let dateStr = date.toLocaleString(locale, dateOptions);

            let statusClass = "table-td";
            let statusStr = '';
            if (withdraw.confirmations === undefined) {
              statusClass += " success";
              statusStr = 'OK';
            } else if (withdraw.confirmations >= CONFIRMATIONS) {
              statusClass += " success";
              statusStr = withdraw.confirmations;
            } else {
              statusClass += " error";
              statusStr = withdraw.confirmations;
            }

            return (
              <div styleName="table-listItem" key={withdraw.txid || Math.random()}>
                <div styleName="table-td table-date">{dateStr}</div>
                <div styleName="table-td table-id">{withdraw.txid}</div>
                <div styleName="table-td table-address">{withdraw.address}</div>
                <div styleName={statusClass}>{statusStr}</div>
                <div styleName="table-td">{amountStr}</div>
              </div>
            );
          });
        else
          Content = (
            <div styleName="empty">Empty</div>
          );

        styleWith += ' button-active';
        break;
    }

    return (
      <div styleName="modal">
        <div styleName="modal-bg" onClick={onClose}></div>
        <div styleName="modal-inner">
          <div styleName="table">
            <div styleName="modal-close" onClick={onClose}></div>
            <div styleName="table-header">
              <div styleName="controls">
                <div styleName="left"></div>
                <div styleName="center"></div>
                <div styleName="right"></div>
              </div>
              <div styleName="options">
                <div styleName={styleDep} onClick={() => this.onChangeTab(TAB_DEPOSITS)}>
                  <div styleName="button-inner">Deposits</div>
                </div>
                <div styleName={styleWith} onClick={() => this.onChangeTab(TAB_WITHDRAWALS)}>
                  <div styleName="button-inner">Withdrawals</div>
                </div>
              </div>
            </div>
            <div styleName="table-list">
              <div styleName="table-head">
                <div styleName="table-td table-date">Date</div>
                <div styleName="table-td table-id">Transaction ID</div>
                {
                  this.state.activeTab == TAB_DEPOSITS &&
                    <div styleName="table-td table-type">Type</div>
                }
                {
                  this.state.activeTab == TAB_WITHDRAWALS &&
                    <div styleName="table-td table-address">Withdraw address</div>
                }
                <div styleName="table-td">Confirmations</div>
                <div styleName="table-td">Amount</div>
              </div>
              <div styleName="table-listInner">
                {Content}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
