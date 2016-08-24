import React, {Component, PropTypes} from 'react';

import Settings from './Settings/Settings';
import {PANEL_SETTINGS} from '../../ducks/windows';


export default class Panels extends Component  {
  render() {
    const {type, onClose, user, updateInfo, onLogout} = this.props;

    let Panel = (<span />);
    switch (type) {
      case PANEL_SETTINGS:
        Panel = (<Settings onClose={onClose} user={user} updateInfo={updateInfo} onLogout={onLogout} />);
    }
    
    return Panel;
  }
}
