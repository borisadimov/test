import React, {Component, PropTypes} from 'react';
import CSSModules from 'react-css-modules';
import Recaptcha from 'react-gcaptcha';

import styles from './Satoshi.sss';


const CAPTCHA_SITE_KEY = '6Le88CMTAAAAAFVzllhP58NKiJPGk6llpfroOnGe';

@CSSModules(styles, {allowMultiple: true})
export default class Satoshi extends Component {
  captchaKey = '';
  state = {
    captchaApproved: false
  };

  captchaApproved = (key) => {
    this.captchaKey = key;
    this.setState({captchaApproved: true});
  };

  onAskSatoshi = (event) => {
    event.preventDefault();
    if (this.state.captchaApproved) {
      const {askSatoshi, onClose} = this.props;
      askSatoshi(this.captchaKey);
      onClose();
    }
  };

  render() {
    const {onClose} = this.props;

    return (
      <div styleName="modal modal-satoshi">
        <div styleName="modal-bg" onClick={onClose}></div>
        <div styleName="modal-inner">
          <div styleName="modal-close" onClick={onClose}></div>
          <div styleName="title">FREE BTC</div>
          <div styleName="subtitle">Receive a free amount to play with!</div>
          <Recaptcha
              sitekey={CAPTCHA_SITE_KEY}
              //onloadCallback={() => this.captachaLoaded()}
              verifyCallback={this.captchaApproved}
              />
          <button styleName={`button ${this.state.captchaApproved === true ? 'button-active' : ''}`}>
            <div styleName="button-inner" onClick={this.onAskSatoshi}>Feed the zebra</div>
          </button>
        </div>
      </div>
    );
  }
}
