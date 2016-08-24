import React, {Component, PropTypes} from 'react';
import CSSModules from 'react-css-modules';

import styles from './Sign.sss';
import {ERROR_USER_EXISTS, ERROR_WRONG_PASS} from '../../../ducks/user';


@CSSModules(styles, {allowMultiple: true})
export default class Sign extends Component  {
  state = {
    username: '',
    password: '',
    alreadyHasAccount: false,
    emptyFields: false
  };

  onUsernameChange = (event) => {
    this.setState({
      username: event.target.value,
      emptyFields: false
    });
  };

  onPasswordChange = (event) => {
    this.setState({
      password: event.target.value,
      emptyFields: false
    });
  };

  onAlreadyButtonClick = () => {
    this.setState({
      alreadyHasAccount: true
    });
  };

  onBackButtonClick = () => {
    this.setState({
      alreadyHasAccount: false,
      password: ''
    });
  };

  onSubmit = (event) => {
    event.preventDefault();
    const {loginOrRegister} = this.props;
    if (this.state.username.length && this.state.password.length)
      loginOrRegister(this.state.username, this.state.password);
    else
      this.setState({emptyFields: true});
    return false;
  };

  componentWillReceiveProps(nextProps) {
    this.setState({
      alreadyHasAccount: this.state.alreadyHasAccount || nextProps.authError == ERROR_USER_EXISTS
    });
  }

  render() {
    const {onLogin, onRegister, loginOrRegister, authError} = this.props;

    let contents = (
      <div styleName="Sign">
        <div styleName="title">Welcome to Zebra Bitcoin</div>
        <div styleName="subtitle">The best Bitcoin gambling casino ever! </div>

        <form styleName="form" onSubmit={this.onSubmit}>
          <input styleName="input" type="text" placeholder="Enter username" onChange={this.onUsernameChange} />
          <input styleName="input" type="password" placeholder="Enter password" onChange={this.onPasswordChange} />
          <div styleName="button" onClick={this.onSubmit}>
            <div styleName="button-inner">Get Started!</div>
          </div>
          {
            authError ==  ERROR_WRONG_PASS &&
              <div styleName="or">WRONG PASSWORD!</div>
          }
          {
            this.state.emptyFields &&
              <div styleName="or">YOU MUST TYPE BOTH FIELDS</div>
          }
        </form>
      </div>
    );

    /*
    let submitReg = (event) => {
      event.preventDefault();
      onRegister(this.state.username);
      return false;
    };
    let submitLogin = (event) => {
      event.preventDefault();
      onLogin(this.state.username, this.state.password);
      return false;
    };

    var contents = (
      <div styleName="Sign">
        <div styleName="title">Welcome to Zebra Bitcoin</div>
        <div styleName="subtitle">The best Bitcoin gambling casino ever! </div>

        <form styleName="form" onSubmit={submitReg}>
          <input styleName="input" type="text" placeholder="Enter username" onChange={this.onUsernameChange} />
          <div styleName="button" onClick={() => onRegister(this.state.username)}>
            <div styleName="button-inner">Get Started!</div>
          </div>
        </form>

        <div styleName="or">or</div>
        <div styleName="already" onClick={this.onAlreadyButtonClick}>Already have an account?</div>
      </div>
    );


    if (this.state.alreadyHasAccount) {
      contents = (
        <div styleName="Sign">
          <div styleName="title">Welcome back to Zebra Bitcoin</div>
          <div styleName="subtitle">The best Bitcoin gambling casino ever! </div>

          <form styleName="form" onSubmit={submitLogin}>
            <input styleName="input" type="text" placeholder="Enter username" onChange={this.onUsernameChange} />
            <input styleName="input" type="password" placeholder="Enter password" onChange={this.onPasswordChange} />
            <div styleName="button" onClick={() => onLogin(this.state.username, this.state.password)}>
              <div styleName="button-inner">Get Started!</div>
            </div>
          </form>

          {
            authError ==  ERROR_WRONG_PASS &&
              <div styleName="or">WRONG PASSWORD!</div>
          }

          <div styleName="or">or</div>
          <div styleName="already" onClick={this.onBackButtonClick}>Back to registration</div>
        </div>
      );
    }
    */

    return (
        <div>
          {contents}
        </div>
      );
  }
}
