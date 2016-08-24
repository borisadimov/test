import React, {Component, PropTypes} from 'react';
import CSSModules from 'react-css-modules';

import {MODAL_ALERT_NO_FREE, MODAL_ALERT_NOT_ENOUGH, MODAL_ALERT_NO_PROFIT,MODAL_ALERT_GAME_STOPPED} from '../../../ducks/windows';
import styles from './Alert.sss';


@CSSModules(styles, {allowMultiple: true})
export default class Alert extends Component {
  render() {
    const {type, onClose} = this.props;

    return (
      <div styleName="modal modal-alert">
        <div styleName="modal-bg" onClick={onClose}></div>
        <div styleName="modal-inner">
          <div styleName="modal-close" onClick={onClose}></div>
          {
            type == MODAL_ALERT_NO_FREE &&
              <div styleName="subtitle">
                <img styleName="icon" src={require('./bear.svg')}/>
                {"Sorry, but you're too rich."}
              </div>
          }
          {
            type == MODAL_ALERT_NOT_ENOUGH &&
              <div styleName="subtitle">
                <img styleName="icon" src={require('./rabbit.svg')}/>
                {"Sorry, but you're too beggarly."}
              </div>
          }
          {
            type == MODAL_ALERT_NO_PROFIT &&
            <div styleName="subtitle">
              <img styleName="icon" src={require('./rabbit.svg')}/>
              {"Sorry, but you're select bet with no profit."}
            </div>
          }
          {
            type == MODAL_ALERT_GAME_STOPPED &&
            <div styleName="subtitle">
              <img styleName="icon" src={require('./rabbit.svg')}/>
              {"Hello, game is currently disabled."}
            </div>
          }
          <button styleName={'button button-active'}>
            <div styleName="button-inner" onClick={onClose}>TRY IT NEXT TIME</div>
          </button>
        </div>
      </div>
    );
  }
}
