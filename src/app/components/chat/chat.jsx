import React, { Component } from 'react';
import { connect } from 'react-redux';
import Moment from 'moment';
import { setData } from '../../actions/actions';
import * as CONSTANTS from '../../constants/constants';
import Helpers from '../common/helpers';
import Icon from '../common/lib/icon/icon';
import Log from '../../assets/svg/log.svg';
import Avatar from '../../assets/svg/avatar.svg';

class Chat extends Component {

  static renderMessage(message) {
    return (
      <li key={`message-${Moment(message.timestamp)}`} className={`message ${message.user === 'Me' ? 'me' : ''}`}>
        <Icon glyph={Avatar} />
        <div className="message-wrapper">
          <div className="message-meta">
            <span className="message-username">{message.user}</span>, <span className="message-timestamp">{Moment(message.timestamp).format('hh:mm')}</span>
          </div>
          <div className="message-payload">{message.payload}</div>
        </div>
      </li>
    );
  }

  constructor(props) {
    super(props);

    this.state = {
      messages: [],
      notifications: 0,
      alreadySeen: 0
    };

    this.toggleState = this.toggleState.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
    this.typing = this.typing.bind(this);
    this.handleShortcut = this.handleShortcut.bind(this);

    this.hoverSfx = new Audio(`${CONSTANTS.ASSETS_PATH}mp3/hover.mp3`);
    this.clickSfx = new Audio(`${CONSTANTS.ASSETS_PATH}mp3/click.mp3`);
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleShortcut, false);
  }

  componentDidUpdate() {
    this.scrollList.scrollTop = this.scrollList.scrollHeight + 200;
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleShortcut, false);
  }

  updateNotifications() {
    if (!this.props.chatOn // Skip it if the chat panel is opened
      && this.state.messages.length > 0 // Don't count if there are no messages
      && this.state.messages[this.state.messages.length - 1].payload !== '' // Don't count it's a false update
      && this.state.notifications !== this.state.messages.length // Only count if there's a new message
      && this.state.messages.length - (this.state.alreadySeen + this.state.notifications) > 0) { // Only count if we haven't seen the new messages
      this.setState({ notifications: this.state.notifications + 1 }, () => {
        Helpers.animate(this.logIcon, 'tada');
        Helpers.animate(this.notificationsIcon, 'tada');
      });
    }

    if (this.props.chatOn && this.state.messages.length > this.state.alreadySeen) {
      this.setState({ alreadySeen: this.state.alreadySeen + 1 });
    }
  }

  toggleState() {
    this.setState({
      alreadySeen: this.state.alreadySeen + this.state.notifications,
      notifications: 0
    }, () => {
      this.props.setData(CONSTANTS.SET_CHAT_ON, !this.props.chatOn);
      if (!this.props.chatOn) this.message.focus();
      else this.message.blur();
    });
    if (this.props.settings.sfxOn) this.clickSfx.play();
  }

  sendMessage(event) {
    event.preventDefault();

    if (this.message.value) {
      this.props.webrtc.sendDirectlyToAll('chat', 'message', this.message.value);
      this.addNewMessage(true, null, this.message.value);
      this.message.value = '';
      if (this.props.settings.sfxOn) this.clickSfx.play();
    }
    setTimeout(() => {
      this.message.focus();
    }, 100);
  }

  addNewMessage(isLocal, id, payload) {
    const messages = this.state.messages;
    let nick = '';

    if (!isLocal) {
      this.props.videos.forEach((video) => {
        if (video.id === id) {
          nick = video.nick;
        }
      });
    }

    messages.push({ user: isLocal ? this.props.settings.username : nick, payload, timestamp: Moment.utc() });
    this.setState({ messages }, () => this.updateNotifications());
  }

  typing() {
    this.props.webrtc.sendDirectlyToAll('chat', 'typing', null);
  }

  handleShortcut(evt) {
    let isC = false;

    if ('key' in evt) {
      isC = (evt.code === 'ArrowDown' || evt.key === 'ArrowDown');
    } else {
      isC = (evt.keyCode === 40);
    }

    if (isC) { this.toggleState(); }
  }

  render() {
    return (
      <section className="chat">
        <div className={`sidenav ${this.props.chatOn ? 'opened' : 'closed'}`}>
          <div
            className="chat-trigger tooltip"
            onMouseEnter={() => { if (this.props.settings.sfxOn) this.hoverSfx.play(); }}
            onClick={this.toggleState}
          >
            <span className="tooltip-text left">Press &darr; to toggle</span>
            <div ref={(item) => { this.logIcon = item; }}><Icon glyph={Log} /></div>
            {this.state.notifications > 0
              ? <div className="notifications" ref={(item) => { this.notificationsIcon = item; }}>{this.state.notifications}</div>
              : null}
          </div>
          <div className="nav-scroll">
            <ul className="nav-items" ref={(item) => { this.scrollList = item; }}>
              {this.state.messages.map(message => Chat.renderMessage(message))}
            </ul>
          </div>
          <form className="type-message-wrapper" onSubmit={this.sendMessage}>
            <input
              type="text"
              className="message"
              placeholder="Enter your message"
              ref={(item) => { this.message = item; }}
              onKeyPress={this.typing}
            />
          </form>
        </div>
      </section>
    );
  }
}

const mapStateToProps = ({
  mainReducer: {
    settings,
    chatOn
  }
}) => ({
  settings,
  chatOn
});

const mapDispatchToProps = {
  setData
};

export default connect(mapStateToProps, mapDispatchToProps, null, { withRef: true })(Chat);
