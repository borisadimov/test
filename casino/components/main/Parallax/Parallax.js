import React, {Component, PropTypes} from 'react';
import CSSModules from 'react-css-modules';

import styles from './Parallax.sss';


@CSSModules(styles, {allowMultiple: true})
export default class Parallax extends Component  {

  render() {
    return (
      <div styleName="parallax">
        <div styleName="moon"></div>
        <div styleName="yellow-planet"></div>
        <div styleName="blue-planet"></div>
        <div styleName="dark-planet"></div>
        <div styleName="stars"></div>
        <div styleName="big-stars"></div>
        <div styleName="comet-left"></div>
        <div styleName="comet-right"></div>
        <div styleName="dark-comet-left"></div>
        <div styleName="dark-comet-right"></div>
      </div>
      );
    }
  }
