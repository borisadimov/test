import React, {Component, PropTypes} from 'react';
import CSSModules from 'react-css-modules';
import qrCode from 'qrcode-npm';

import styles from './Deposit.sss';
import {CONFIRMATIONS} from 'models/btc';


@CSSModules(styles, {allowMultiple: true})
export default class Deposit extends Component {
  generateQR() {
    const {address} = this.props;

    let qr = qrCode.qrcode(4, 'M');
    qr.addData(address);
    qr.make();
    return qr.createImgTag(4);
  }

  render() {
    const {onClose, address} = this.props;
    let qr = this.generateQR();

    return (
      <div styleName="modal modal-deposit">
        <div styleName="modal-bg" onClick={onClose}></div>
        <div styleName="modal-inner">
          <div styleName="modal-close" onClick={onClose}></div>
          <div styleName="title">Deposit</div>
          <div styleName="subtitle">Your personal Bitcoin deposit address is:</div>
          <div styleName="btc-address">{address}</div>
          <div styleName="qr-container"
               dangerouslySetInnerHTML={{ __html: qr}}>
          </div>

          <div styleName="info">Deposits require {CONFIRMATIONS} confirmations before being credited.</div>
        </div>
      </div>
    );
  }
}
