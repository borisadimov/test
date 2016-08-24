import React, {Component, PropTypes} from 'react';
import CSSModules from 'react-css-modules';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import styles from './TableList.sss';

import TableItem from '../TableItem/TableItem';
import {TAB_USER, TAB_LAST_30, TAB_TOP_30, changeTab} from 'ducks/bets';
import {math} from '../../../../index';


export const MAX_LENGTH = 30;

@CSSModules(styles, {allowMultiple: true})
export default class TableList extends Component  {
  socket = null;
  
  state = {
    currentBets: [],
    activeTab: TAB_LAST_30
  };

  fetching = false;
  betsUser = [];
  betsLast30 = [];
  betsTop30 = [];

  componentDidMount() {
    const {socket, getHistory} = this.props;
    this.socket = socket;
    getHistory();

    if (socket)
      socket.on('bet', this.onBetReceived);
  }

  componentWillUnmount() {
    if (this.socket)
      this.socket.removeListener('bet', this.onBetReceived);
  }

  lengthControl() {
    if (this.betsLast30.length > MAX_LENGTH)
      this.betsLast30.pop();
    if (this.betsUser.length > MAX_LENGTH)
      this.betsUser.pop();
    if (this.betsTop30.length > MAX_LENGTH)
      this.betsTop30.pop();
  }

  setCurrentBets() {
    if (!this.fetching) {
      switch (this.state.activeTab) {
        case TAB_USER:
          this.setState({currentBets: this.betsUser});
          break;
        case TAB_LAST_30:
          this.setState({currentBets: this.betsLast30});
          break;
        case TAB_TOP_30:
          this.setState({currentBets: this.betsTop30});
          break;
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!this.betsUser.length)
      this.betsUser = nextProps.betsUser;
    if (!this.betsLast30.length)
      this.betsLast30 = nextProps.betsLast30;
    if (!this.betsTop30.length)
      this.betsTop30 = nextProps.betsTop30;
    this.lengthControl();

    this.fetching = nextProps.fetching;
    this.setState({activeTab: nextProps.activeTab}, () => this.setCurrentBets());
  }

  onBetReceived = data => {
    let bet = data.bet;

    this.betsLast30.unshift(bet);
    if (bet.player_id == this.props.userId)
      this.betsUser.unshift(bet);
    if (math.larger(bet.amount, 1))
      this.betsUser.unshift(bet);

    this.lengthControl();
    this.setCurrentBets();
  };

  render() {
    let listWithItems;
    if (this.state.currentBets.length)
      listWithItems = this.state.currentBets.map(b =>
        <TableItem bet={b} key={b._id || Math.random()} />
      );
    else
      listWithItems = (
        <div styleName="empty">Empty</div>
      );

    return (
      <div styleName="table-list">
        <div styleName="table-head">
          <div styleName="table-td">Id</div>
          <div styleName="table-td">User</div>
          <div styleName="table-td">Number</div>
          <div styleName="table-td">Prediction</div>
          <div styleName="table-td">Bet size</div>
          <div styleName="table-td">Win odds</div>
          <div styleName="table-td">Profit</div>
        </div>
        <div styleName="table-listInner">
          <ReactCSSTransitionGroup transitionName="example" transitionEnterTimeout={500} transitionLeaveTimeout={300}>
            {listWithItems}
          </ReactCSSTransitionGroup>
        </div>
      </div>
    );
  }
}
