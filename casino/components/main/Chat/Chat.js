import React, {Component, PropTypes} from 'react';
import CSSModules from 'react-css-modules';

import styles from './Chat.sss';


export const MAX_LENGTH = 100;

@CSSModules(styles, {allowMultiple: true})
export default class Chat extends Component  {
  state = {
    message: '',
    messages: [],
    showRabbit: false
  };

  constructor() {
    super();
  }

  componentDidMount() {
    const {socket, getHistory, onSend} = this.props;
    this.socket = socket;
    this.onSend = onSend;

    getHistory();
    setTimeout(() => {
      if (!this.state.messages.length)
        this.setState({showRabbit: true});
    }, 50);

    if (socket)
      socket.on('msg', this.onMessageReceived);
  }

  componentWillUnmount() {
    if (this.socket)
      this.socket.removeListener('msg', this.onMessageReceived);
  }

  onMessageReceived = (data) => {
    const {messages} = this.state;
    if (messages.length >= MAX_LENGTH)
      messages.shift();
    messages.push(data);
    this.setState({messages}, () => {
      this.setState({showRabbit: false});
      this._msgs.scrollTop = 9999;
    });
  };

  componentWillReceiveProps(nextProps) {
    this.setState({
      messages: nextProps.history,
      showRabbit: !nextProps.history.length
    });
    setTimeout(() => this._msgs.scrollTop = 9999, 50);
  }

  handleSubmit = (event) => {
    if (event)
      event.preventDefault();

    this.onSend(this.state.message);
    this.setState({message: ''});
  };

  render() {
    const {changeChatVis} = this.props;

    let Messages;
    if (this.state.showRabbit) {
      Messages = (
        <div styleName="rabbit">
          <div styleName="rabbit-icon"></div>
          <div styleName="rabbit-title">There's no messages.</div>
          <div styleName="rabbit-subtitle">Here's a rabbit for now.</div>
        </div>
      )
    } else {
      Messages = (
        this.state.messages.map(msg => {
          return (
            <div styleName="message-item" key={`chat.msg.${msg.id}`}>
              <div styleName="name">{msg.from}</div>
              <div styleName="message">{msg.text}</div>
            </div>
          );
        })
      );
    }

    return (
      <div styleName="Chat">
        <div styleName="Chat-close" onClick={() => changeChatVis(false)}></div>
        <div styleName="Chat-inner">
          <div styleName="title">Chat</div>
          <div styleName="messages" ref={ref => this._msgs = ref}>
            {Messages}
          </div>
          <form styleName="controls" onSubmit={this.handleSubmit}>
            <input styleName="input" placeholder="Write your message here.."
                   required
                   value={this.state.message}
                   onChange={event => this.setState({message: event.target.value})}
            />
            <div styleName="send" onClick={this.handleSubmit}>Send</div>
          </form>
        </div>
      </div>
    );
  }
}
