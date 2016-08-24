import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import CSSModules from 'react-css-modules';

import styles from './app.sss';

import Table from 'components/main/Table/Table';
import Header from 'components/main/Header/Header';
import Roll from 'components/main/Roll/Roll';
import Parallax from 'components/main/Parallax/Parallax';
import Game from 'components/main/Game/Game';
import Sign from 'components/modals/Sign/Sign';
import Panels from 'components/panels';
import Chat from 'components/main/Chat/Chat';
import Modals from 'components/modals';

import {openModal, closeModal, changeChatVis, openPanel, closePanel} from 'ducks/windows';
import {login, register, loginOrRegister, getUserInfo, askSatoshi, logout, getLocalStorage, updateUserInfo, withdraw, getTransactions} from 'ducks/user';
import {getHistory as getChatHistory, sendMessage} from 'ducks/chat';
import {getBetsHistory, updateBet, sendBet, finishAnimation} from 'ducks/bets';


@CSSModules(styles, {allowMultiple: true})
class App extends React.Component {
  componentDidMount() {
    const {getLocalStorage} = this.props.userActions;
    getLocalStorage();
  }

  render() {
    const {windows, user, sockets, chat, bets} = this.props;
    const {openModal, closeModal, changeChatVis, openPanel, closePanel} = this.props.modalActions;
    const {login, register, loginOrRegister, getUserInfo, askSatoshi, logout, updateUserInfo, withdraw, getTransactions} = this.props.userActions;
    const {getChatHistory, sendMessage} = this.props.chatActions;
    const {getBetsHistory, updateBet, sendBet, finishAnimation} = this.props.betsActions;

    var Content = (
      <div className="container">
        <Header balance={user.balance}
                fetching={bets.fetching}
                openModal={openModal}
                openPanel={openPanel}
                changeChatVis={changeChatVis} />
        <div className="container-inner">
          <Game getUserInfo={getUserInfo}
                updateBet={updateBet}
                userBalance={user.balance} />
          <Roll onSend={sendBet}
                state={bets}
                finishAnimation={finishAnimation} />
          {
            windows.chatIsVisible &&
              <Chat socket={sockets.socket}
                    history={chat.history}
                    getHistory={getChatHistory}
                    changeChatVis={changeChatVis}
                    onSend={sendMessage} />
          }
        </div>
        <Table socket={sockets.socket}
               betsUser={bets.betsUser}
               betsLast30={bets.betsLast30}
               betsTop30={bets.betsTop30}
               fetching={bets.fetching}
               getHistory={getBetsHistory}
               userId={user.id} />
      </div>
    );

    if (!user.authorized) {
      Content = (
        <div className="container">
          <Sign onLogin={login}
                onRegister={register}
                loginOrRegister={loginOrRegister}
                authError={user.authError} />
        </div>
      );
    }

    return (
      <div>
        <Panels type={windows.openedPanel}
                onClose={closePanel}
                user={user}
                updateInfo={updateUserInfo}
                onLogout={logout} />
        <Modals type={windows.openedModal}
                onClose={closeModal}
                askSatoshi={askSatoshi}
                doWithdraw={withdraw}
                depositAddress={user.depositAddress}
                withdrawAddress={user.withdrawAddress}
                getTransactions={getTransactions}
                getBalance={getUserInfo}
                balance={user.balance}
                deposits={user.deposits}
                withdrawals={user.withdrawals} />
        <div styleName="wrapper">
          <Parallax />
          {Content}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    windows:  state.windows,
    user:     state.user,
    sockets:  state.sockets,
    chat:     state.chat,
    bets:     state.bets
  };
}

function mapDispatchToProps(dispatch) {
  return {
    modalActions: bindActionCreators({openModal, closeModal, changeChatVis, openPanel, closePanel}, dispatch),
    userActions:  bindActionCreators({login, register, loginOrRegister, getUserInfo, askSatoshi, logout, getLocalStorage, updateUserInfo, withdraw, getTransactions}, dispatch),
    chatActions:  bindActionCreators({getChatHistory, sendMessage}, dispatch),
    betsActions:  bindActionCreators({getBetsHistory, updateBet, sendBet, finishAnimation}, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
