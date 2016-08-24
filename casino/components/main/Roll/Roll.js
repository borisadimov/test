import React, {Component, PropTypes} from 'react';
import CSSModules from 'react-css-modules';

import styles from './Roll.sss';

export const ANIM_DURATION = 2000;
export const ANIM_PERIOD = 30;


@CSSModules(styles, {allowMultiple: true})
export default class Roll extends Component  {
  state = {
    randomValue: 0,
    fetching: false,
    ready: false,
    isFirst: true
  };
  _fetching = false;

  random = 0;
  result = false;


  set fetching(p_fetching) {
    this._fetching = p_fetching;
    this.setState({fetching: p_fetching});
  }
  get fetching() {
    return this._fetching;
  }

  onRoll = () => {
    if (this.fetching)
      return;

    const {onSend} = this.props;
    onSend();
  };

  componentWillReceiveProps(nextProps) {
    this.random = nextProps.state.randomValue;
    this.result = nextProps.state.lastResult;
    this.setState({ready: nextProps.state.ready});

    if (!this.fetching && nextProps.state.fetching)
      this.startAnimation();
  }

  startAnimation() {
    this.fetching = true;
    this.setState({isFirst: false});

    setTimeout(() => this.fetching = false, ANIM_DURATION);
    this.animate();
  }

  animate() {
    if (!this.fetching && this.state.ready) {
      this.setState({randomValue: this.random});
      const {finishAnimation} = this.props;
      finishAnimation();
      return;
    }

    let num = Math.floor(Math.random() * 90) + 10;
    this.setState({randomValue: num});
    setTimeout(() => this.animate(), ANIM_PERIOD);
  }

  render() {
    const {lastResult} = this.props.state;
    let neutral = this.state.fetching || this.state.isFirst;

    return (
      <div styleName="center">
        <div styleName={`round ${neutral ? '' : (lastResult ? 'win' : 'lose')}`}>
          <div styleName="planet"></div>
          <div styleName="value">{this.state.randomValue}</div>
        </div>
        <div styleName={`roll ${neutral ? '' : (lastResult ? 'win' : 'lose')}`}>
          <div styleName={`${this.state.fetching ? 'hidden' : ''}`}>
            {this.state.isFirst ? 'Click to play' : 'Click to continue'}
          </div>
          <div styleName="button" onClick={this.onRoll}>
            <div styleName="antenna">
              <div styleName="antenna-head"></div>
            </div>
            <div styleName="button-inner">{neutral ? 'Roll' : (lastResult ? 'Win' : 'Lose')}</div>
          </div>
        </div>
      </div>
      );
    }
  }
