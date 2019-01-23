import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as CONSTANTS from '../../../constants/constants';
import Helpers from '../helpers';
import Icon from '../../common/lib/icon/icon';
import AudioOn from '../../../assets/svg/audio-on.svg';
import AudioOff from '../../../assets/svg/audio-off.svg';
import VideoOff from '../../../assets/svg/video-off.svg';
import SpeechBubble from '../../../assets/svg/speech-bubble.svg';

class Video extends Component {

  constructor(props) {
    super(props);

    this.state = {
      isMouseOver: false,
      muted: false,
      fullScreen: false
    };

    this.hoverSfx = new Audio(`${CONSTANTS.ASSETS_PATH}mp3/hover.mp3`);
    this.blipSfx = new Audio(`${CONSTANTS.ASSETS_PATH}mp3/blip.mp3`);

    this.toggleMute = this.toggleMute.bind(this);
    this.toggleFullScreen = this.toggleFullScreen.bind(this);
  }

  componentDidMount() {
    if (this.props.el) {
      this.videoWrapper.appendChild(this.props.el);
      Helpers.animate(this.container, 'jackInTheBox');
      if (this.props.settings.sfxOn) this.blipSfx.play();
    }

    if (this.props.pc) {
      this.props.pc.on('iceConnectionStateChange', () => {
        if (this.status) {
          switch (this.props.pc.iceConnectionState) {
            case 'checking': this.status.innerText = 'Connecting...'; break;
            case 'connected': this.status.innerText = ''; break;
            case 'completed': this.status.innerText = ''; break;
            case 'disconnected': this.status.innerText = 'Disconnected'; break;
            case 'failed': this.status.innerText = 'Failed'; break;
            case 'closed': break;
            default: break;
          }
        }
      });
    }
  }

  componentWillReceiveProps(newProps) {
    if (newProps.videoOn !== this.props.videoOn) {
      Helpers.animate(this.container, 'rubberBand');
    }
    if (newProps.micOn !== this.props.micOn) {
      Helpers.animate(this.container, 'tada');
    }
  }

  componentWillUnmount() {
    if (this.props.el) {
      this.videoWrapper.removeChild(this.props.el);
    }
  }

  toggleMute(event) {
    event.preventDefault();
    event.stopPropagation();
    const video = document.getElementById(`${this.props.id}_video_incoming`);
    if (!this.state.muted) video.volume = 0;
    else video.volume = 1;
    this.setState({ muted: !this.state.muted });
  }

  toggleFullScreen() {
    this.setState({ fullScreen: !this.state.fullScreen });
    this.props.toggleFullScreen(!this.state.fullScreen);
  }

  render() {
    const { typing, micOn, videoOn, id, nick } = this.props;
    // let { volume } = this.props;
    // if (this.state.fullScreen) { volume = 1; }

    return (
      <div
        className={`video-wrapper ${videoOn ? 'on' : 'off'} ${this.state.fullScreen ? 'full-screen' : 'circle'}`}
        ref={(item) => { this.container = item; }}
        id={`container-${id}`}
        onClick={this.toggleFullScreen}
        onMouseEnter={() => { if (!this.state.fullScreen) this.setState({ isMouseOver: true }); if (this.props.settings.sfxOn) this.hoverSfx.play(); }}
        onMouseLeave={() => { if (!this.state.fullScreen) this.setState({ isMouseOver: false }); }}
      >
        { /* <div className="volume" id={`volume-${id}`} style={{ transform: `scale(${volume})` }} /> */}
        <div className="status" ref={(item) => { this.status = item; }} />
        <div className={`video-overflow-wrapper ${micOn ? 'on' : 'off'}`} ref={(item) => { this.videoWrapper = item; }} id={`wrapper-${id}`}>
          {!videoOn ? <Icon glyph={VideoOff} /> : null}
        </div>
        <div className="username">{nick}</div>
        {typing ? <div className="typing-wrapper">
          <div className="dots">
            <span className="dot" />
            <span className="dot" />
            <span className="dot" />
          </div>
          <Icon glyph={SpeechBubble} />
        </div> : null}
        {this.state.isMouseOver || this.state.muted ? <button className={`btn btn-primary btn-mute ${this.state.muted ? 'off' : 'on'}`} onClick={this.toggleMute}>
          {this.state.muted ? <Icon glyph={AudioOff} /> : <Icon glyph={AudioOn} />}
        </button> : null}
      </div>
    );
  }
}

const mapStateToProps = ({
  mainReducer: {
    settings
  }
}) => ({
  settings
});

const mapDispatchToProps = null;

export default connect(mapStateToProps, mapDispatchToProps)(Video);
