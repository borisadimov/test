import React, {Component, PropTypes} from 'react';
import CSSModules from 'react-css-modules';

import styles from './Table.sss';
import TableList from './TableList/TableList';
import {TAB_USER, TAB_LAST_30, TAB_TOP_30} from '../../../ducks/bets';


@CSSModules(styles, {allowMultiple: true})
export default class Table extends Component  {
  state = {
    activeTab: TAB_LAST_30
  };

  onChangeTab(activeTab) {
    this.setState({activeTab});
  }

  render() {
    const {socket} = this.props;

    let styleUser = 'button';
    let styleAll = 'button';
    let styleTop = 'button';
    switch (this.state.activeTab) {
      case TAB_USER:    styleUser += ' button-active'; break;
      case TAB_LAST_30: styleAll  += ' button-active'; break;
      case TAB_TOP_30:  styleTop  += ' button-active'; break;
    }

    return (
      <div styleName="table">
        <div styleName="table-header">
          <div styleName="controls">
            <div styleName="left"></div>
            <div styleName="center"></div>
            <div styleName="right"></div>
          </div>
          <div styleName="options">
            <div styleName={styleUser} onClick={() => this.onChangeTab(TAB_USER)}>
              <div styleName="button-inner">My bets</div>
            </div>
            <div styleName={styleAll} onClick={() => this.onChangeTab(TAB_LAST_30)}>
              <div styleName="button-inner">All bets</div>
            </div>
            <div styleName={styleTop} onClick={() => this.onChangeTab(TAB_TOP_30)}>
              <div styleName="button-inner">Best astro</div>
            </div>
          </div>
        </div>
        <TableList socket={this.props.socket}
                   betsUser={this.props.betsUser}
                   betsLast30={this.props.betsLast30}
                   betsTop30={this.props.betsTop30}
                   getHistory={this.props.getHistory}
                   userId={this.props.userId}
                   fetching={this.props.fetching}
                   activeTab={this.state.activeTab}
        />
      </div>
      );
    }
  }
