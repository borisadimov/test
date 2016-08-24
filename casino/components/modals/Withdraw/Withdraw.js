import React, {Component, PropTypes} from 'react';
import CSSModules from 'react-css-modules';

import styles from './Withdraw.sss';
import {math, formatMBTC} from '../../../index';
import {BITCOIN, FEE} from '../../../models/btc';

const ERROR_FEE         = 'ERROR_FEE';
const ERROR_NOT_ENOUGH  = 'ERROR_NOT_ENOUGH';
const ERROR_NO_ADDRESS  = 'ERROR_NO_ADDRESS';


@CSSModules(styles, {allowMultiple: true})
export default class Withdraw extends Component {
  state = {
    amountInput: '',
    address: '',
    error: null
  };
  amount = null;

  componentDidMount() {
    const {balance, address} = this.props;
    this.amount = balance;
    this.setState({
      amountInput: formatMBTC(this.amount) + ' mB',
      address
    });
  }

  onChangeAmount = (event) => {
    let str = event.target.value;

    let re = /^\d*\.?\d*$/;
    if (!str.match(re))
      return;

    let num = math.bignumber(0);
    if (str.length)
      num = math.bignumber(str);

    this.amount = math.divide(num, BITCOIN);
    this.setState({amountInput: str});
  };

  onAmountFocus = () => {
    let str = formatMBTC(this.amount);
    this.setState({amountInput: str, error: null});
  };

  onAmountBlur = () => {
    let str = formatMBTC(this.amount) + ' mB';
    this.setState({amountInput: str});
  };

  onChangeAddress = (event) => {
    let value = event.target.value;
    this.setState({address: value, error: null});
  };

  handleSubmit = (event) => {
    event.preventDefault();
    const {doWithdraw, onClose, balance} = this.props;

    if (math.larger(math.bignumber(FEE), this.amount)) {
      this.setState({error: ERROR_FEE});
      return;
    }
    if (math.larger(this.amount, balance)) {
      this.setState({error: ERROR_NOT_ENOUGH});
      return;
    }
    if (!this.state.address) {
      this.setState({error: ERROR_NO_ADDRESS});
      return;
    }

    doWithdraw(this.state.address, this.amount);
    onClose();
  };

  render() {
    const {onClose, balance} = this.props;

    let balanceStr = formatMBTC(balance);
    let fee = (parseFloat(FEE) * BITCOIN).toString() + ' mB';

    return (
      <div styleName="modal modal-withdraw">
        <div styleName="modal-bg" onClick={onClose}></div>
        <div styleName="modal-inner">
          <div styleName="modal-close" onClick={onClose}></div>
          <div styleName="title">Withdraw</div>
          <div styleName="subtitle">Your withdrawal will be sent once<br/>there are no unconfirmed deposits on your account. </div>
          <div styleName="balance">YOUR BALANCE: {balanceStr} mB</div>
          <form styleName="form">
            <input styleName="input"
                   placeholder="Enter your bitcoin address"
                   value={this.state.address}
                   onChange={this.onChangeAddress}>
            </input>
            <input styleName="input"
                   placeholder="Enter the amount"
                   value={this.state.amountInput}
                   onFocus={this.onAmountFocus}
                   onBlur={this.onAmountBlur}
                   onChange={this.onChangeAmount}>
            </input>
            {
              this.state.error == ERROR_FEE &&
                <div styleName="error">Your can't cover the fee!</div>
            }
            {
              this.state.error == ERROR_NOT_ENOUGH &&
                <div styleName="error">Your balance is not enough!</div>
            }
            {
              this.state.error == ERROR_NO_ADDRESS &&
                <div styleName="error">You must type the address!</div>
            }
            <button styleName="button" onClick={this.handleSubmit}>
              <div styleName="button-inner">Proceed</div>
            </button>
          </form>
          <div styleName="info">* Your withdrawal must be at least <span styleName="value">{fee}</span> to cover the transaction fee.</div>
        </div>
      </div>
    );
  }
}
