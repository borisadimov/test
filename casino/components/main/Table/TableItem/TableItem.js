import React, {Component, PropTypes} from 'react';
import CSSModules from 'react-css-modules';

import styles from './TableItem.sss';
import {formatMBTC} from '../../../../index';


@CSSModules(styles, {allowMultiple: true})
export default class TableItem extends Component  {

  render() {
    const {bet, key} = this.props;

    let amount = formatMBTC(bet.amount) + ' mB';
    let profit = formatMBTC(bet.profit) + ' mB';
    return (
      <div styleName="table-listItem" key={key}>
        <div styleName="table-td">{bet._id}</div>
        <div styleName="table-td">{bet.player}</div>
        <div styleName="table-td">{bet.roll}</div>
        <div styleName="table-td">{bet.condition ? '>' : '<' } {bet.target}</div>
        <div styleName="table-td">{amount}</div>
        <div styleName="table-td">{(bet.condition ? (99 - bet.target) : bet.target) + '%'} </div>
        <div styleName={`table-td ${bet.win ? 'win' : 'lose'}`}> {profit}</div>
      </div>
      );
    }
  }
