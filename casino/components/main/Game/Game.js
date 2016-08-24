import React, {Component, PropTypes} from 'react';
import CSSModules from 'react-css-modules';


import styles from './Game.sss';
import {SATOSHI, BITCOIN, MAX_DIGITS_BTC, MAX_DIGITS_MBTC} from '../../../models/btc';
import {math, formatMBTC} from '../../../index';

export const START_AMOUNT = '0.000001';


@CSSModules(styles, {allowMultiple: true})
export default class Game extends Component  {
  userBalance = null;
  updateBet = null;

  state = {
    bet: {
      amount: math.bignumber(START_AMOUNT),
      condition: false,
      target: 50
    },

    profit: 0,
    chance: 0,

    targetInput: '50',
    amountInput: '0.00100 mB'
  };

  setAmount(amount) {
    let input = formatMBTC(amount) + ' mB';
    this.setState({bet: {...this.state.bet, amount}, amountInput: input}, () => this.countProfit());
  }

  onChangeAmount = (event) => {
    let str = event.target.value;

    let re = /^\d*\.?\d*$/;
    if (!str.match(re))
      return;

    let num = math.bignumber(0);
    if (str.length)
      num = math.bignumber(str);

    let amount = math.divide(num, BITCOIN);
    if (math.smaller(amount, math.bignumber(SATOSHI)))
      amount =  math.bignumber(SATOSHI);
    this.setState({bet: {...this.state.bet, amount}, amountInput: str}, () => this.countProfit());
  };

  onAmountFocus = () => {
    let str = formatMBTC(this.state.bet.amount);
    this.setState({amountInput: str});
  };

  onAmountBlur = () => {
    let str = formatMBTC(this.state.bet.amount) + ' mB';
    this.setState({amountInput: str});
  };

  onBetHalf = () => {
    let value = math.divide(this.state.bet.amount, 2);
    if (math.largerEq(value, math.bignumber(SATOSHI)))
      this.setAmount(value);
  };

  onBetDouble = () => {
    let value = math.multiply(this.state.bet.amount, 2);
    this.setAmount(value);
  };

  onBetMax = () => {
    this.setAmount(this.userBalance);
  };

  onChangeCondition = (value) => {
    this.setState({bet: {...this.state.bet, condition: value}}, () => this.countProfit());
  };

  onTargetChange = (event) => {
    let str = event.target.value;

    let re = /^\d{0,2}$/;
    if (!str.match(re))
      return;

    let num = 0;
    if (str.length)
      num = parseInt(str);
    if (num == 0 && !this.state.bet.condition)
      num = 1;

    this.setState({bet: {...this.state.bet, target: num}, targetInput: str}, () => this.countProfit());
  };

  onTargetBlur = () => {
    let str = this.state.bet.target;
    this.setState({targetInput: str});
  };

  countProfit() {
    let chance = this.state.bet.target;
    if (this.state.bet.condition)
      chance = 99 - chance;

    if (chance == 0)
      chance = 0.000001;

    let multiplier = math.bignumber(math.multiply(math.divide(100, chance), 0.99));

    let profit = math.multiply(this.state.bet.amount, math.add(multiplier, -1));
    if (math.smaller(profit, math.bignumber(SATOSHI)))
      profit = math.bignumber(0);

    this.setState({profit: formatMBTC(profit), chance});

    if (this.updateBet != null)
      this.updateBet(this.state.bet, math.larger(profit, 0));
  }

  componentDidMount() {
    const {getUserInfo, updateBet} = this.props;
    this.updateBet = updateBet;
    this.countProfit();
    getUserInfo();
  }

  componentWillReceiveProps(nextProps) {
    this.userBalance = nextProps.userBalance;
  }

  render() {
    return (
      <div styleName="game">
        <div styleName="groups">
          <div styleName="left-top"></div>
          <div styleName="right-top"></div>
          <div styleName="left-bottom"></div>
          <div styleName="right-bottom"></div>
        </div>
        <div styleName="title">Your bet</div>
        <div styleName="buttons">
          <div styleName="button" onClick={this.onBetHalf}>
            <span styleName="colored">1</span>/2
          </div>
          <div styleName="button centered" onClick={this.onBetDouble}>
            <span styleName="colored">2</span>X
          </div>
          <div styleName="button" onClick={this.onBetMax}>
            <span styleName="colored">M</span>A<span styleName="colored">X</span>
          </div>
        </div>
        <div styleName="bet-label">
          <input styleName="bet"
                 value={this.state.amountInput}
                 onFocus={this.onAmountFocus}
                 onBlur={this.onAmountBlur}
                 onChange={this.onChangeAmount}/>
        </div>
        <div styleName="profit-chance">
          <div styleName="profit">Profit:<span styleName="profit-value">{this.state.profit} mB</span></div>
          <div styleName="win-chance">Win chance:<span styleName="win-chance-value">{this.state.chance}%</span></div>
        </div>
        <div styleName="prediction">
          <div styleName={this.state.bet.condition ? "button" : "button button-active"}
               onClick={() => this.onChangeCondition(false)}>
            Lower
          </div>
          <label styleName="input-label">
            <input styleName="input"
                   value={this.state.targetInput}
                   onBlur={this.onTargetBlur}
                   onChange={this.onTargetChange} />
          </label>
          <div styleName={this.state.bet.condition ? "button button-active" : "button"}
               onClick={() => this.onChangeCondition(true)}>
            Higher
          </div>
        </div>
      </div>
    );
  }
}
