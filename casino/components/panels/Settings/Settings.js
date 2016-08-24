import React, {Component, PropTypes} from 'react';
import CSSModules from 'react-css-modules';

import styles from './Settings.sss';


@CSSModules(styles, {allowMultiple: true})
export default class Settings extends Component  {
  updateInfo = null;
  onClose = null;

  state = {
    info: {
      username: '',
      password: '',
      email: '',
      withdrawAddress: '',
      isPasswordUpdated: false
    },

    complete: false,
    error: false
  };

  componentDidMount() {
    const {user, updateInfo, onClose} = this.props;
    this.setState({info: {
      ...this.state.info,
      username:           user.username,
      email:              user.email,
      withdrawAddress:    user.withdrawAddress,
      isPasswordUpdated:  user.isPasswordUpdated
    }});
    this.updateInfo = updateInfo;
    this.onClose = onClose;
  }

  handleSubmit = (event) => {
    if (event)
      event.preventDefault();

    let info = this.state.info;
    if (!info.username || !info.username.length)
      delete info.username;
    if (!info.password || !info.password.length)
      delete info.password;

    this.updateInfo(info);
    this.setState({complete: true}, () => setTimeout(this.onClose, 500));
  };

  onNameChange = (event) => {
    let value = event.target.value;
    this.setState({info: {...this.state.info, username: value}});
  };

  onPasswordChange = (event) => {
    let value = event.target.value;
    this.setState({info: {...this.state.info, password: value}});
  };

  onEmailChange = (event) => {
    let value = event.target.value;
    this.setState({info: {...this.state.info, email: value}});
  };

  onAddressChange = (event) => {
    let value = event.target.value;
    this.setState({info: {...this.state.info, withdrawAddress: value}});
  };

  onLogout = () => {
    const {onLogout} = this.props;
    this.onClose();
    setTimeout(() => onLogout(), 300);
  };

  render() {
    let completeSettings = 'Settings-inner save-inner';
    if (this.state.complete) {
      completeSettings = completeSettings + ' save-innerActive';
    }

    return (
      <div styleName="Settings">
        <div styleName={completeSettings}>
          <div styleName="save-complete">
            <img src={require('./cat.svg')} />
            Save complete!
          </div>
        </div>
        <div styleName="Settings-inner">
          <div styleName="close-button" onClick={this.onClose}></div>
          <div styleName='title'>Profile settings</div>
          <div styleName='info'>
            {
              !this.state.info.isPasswordUpdated &&
                <div styleName="visit">
                  Your account was automatically created when you first visited the website.
                </div>
            }
            <div>
              If you have cookies enabled, you will be automatically logged in each time you visit from this computer.
            </div>

            {
              this.state.error &&
                <div>
                  You must type requierd fields!
                </div>
            }
          </div>

          <form styleName="form" onSubmit={this.handleSubmit}>
            <div styleName="profile">
              <div styleName="profile-item">
                <div styleName="label">Username</div>
                <input styleName="input"
                       placeholder="(not changed)"
                       value={this.state.info.username}
                       onChange={this.onNameChange} />
                <div styleName="edit"></div>
              </div>
              <div styleName="profile-item">
                <div styleName="label">Password</div>
                {
                  !this.state.info.isPasswordUpdated &&
                    <div styleName="label password-hint">
                      Your password is not specified. Please, set it!
                    </div>
                }
                <input styleName="input"
                       type="password"
                       placeholder="(not changed)"
                       value={this.state.info.password}
                       onChange={this.onPasswordChange}/>
                <div styleName="edit"></div>
              </div>
              <div styleName="profile-item">
                <div styleName="label">Recovery Email</div>
                <input styleName="input"
                       placeholder="(empty)"
                       value={this.state.info.email}
                       onChange={this.onEmailChange}/>
                <div styleName="edit"></div>
              </div>
              <div styleName="profile-item">
                <div styleName="label">Withdraw address</div>
                <input styleName="input"
                       placeholder="(empty)"
                       value={this.state.info.withdrawAddress}
                       onChange={this.onAddressChange}/>
                <div styleName="edit"></div>
              </div>
            </div>

            <div styleName="button">
              <div styleName="button-inner"
                   type="submit"
                   onClick={this.handleSubmit}>
                Save
              </div>
            </div>
          </form>

          <div styleName="logout">
            <div styleName="logout-inner" onClick={this.onLogout}>
              <img src={require('./logout.svg')} />
              Log out
            </div>
          </div>
        </div>
      </div>
    );
  }
}
