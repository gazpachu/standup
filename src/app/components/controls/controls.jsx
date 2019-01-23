import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as CONSTANTS from '../../constants/constants';
import { setData, setNotification } from '../../actions/actions';
import Icon from '../common/lib/icon/icon';
import MicOn from '../../assets/svg/mic-on.svg';
import MicOff from '../../assets/svg/mic-off.svg';
import VideoOn from '../../assets/svg/video-on.svg';
import VideoOff from '../../assets/svg/video-off.svg';
import AudioOn from '../../assets/svg/audio-on.svg';
import AudioOff from '../../assets/svg/audio-off.svg';
import ScreenOn from '../../assets/svg/screen-on.svg';
import ScreenOff from '../../assets/svg/screen-off.svg';
// import Upload from '../../assets/svg/upload.svg';

class Controls extends Component {

  constructor(props) {
    super(props);

    this.state = {
      screenShareEnabled: false,
      screenShareOn: false,
      uploading: false
    };

    this.hoverSfx = new Audio(`${CONSTANTS.ASSETS_PATH}mp3/hover.mp3`);
    this.clickSfx = new Audio(`${CONSTANTS.ASSETS_PATH}mp3/click.mp3`);

    this.toggleMic = this.toggleMic.bind(this);
    this.toggleVideo = this.toggleVideo.bind(this);
    this.toggleAudio = this.toggleAudio.bind(this);
    this.toggleScreenShare = this.toggleScreenShare.bind(this);
    this.checkScreenShareExtension = this.checkScreenShareExtension.bind(this);
    this.handleShortcut = this.handleShortcut.bind(this);
    this.uploadFile = this.uploadFile.bind(this);
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleShortcut, false);
  }

  componentWillReceiveProps(newProps) {
    if (newProps.webrtc !== this.props.webrtc) { // Load settings just once when WebRTC is loaded
      if (!this.props.settings.micOn) {
        newProps.webrtc.mute();
        this.props.setData(CONSTANTS.SET_MIC_ON, !this.props.micOn);
      }
      if (!this.props.settings.videoOn) {
        newProps.webrtc.pauseVideo();
        this.props.setData(CONSTANTS.SET_VIDEO_ON, !this.props.videoOn);
      }
      if (!this.props.settings.audioOn) {
        newProps.webrtc.setVolumeForAll(0);
        this.props.setData(CONSTANTS.SET_AUDIO_ON, !this.props.audioOn);
      }

      setTimeout(() => {
        if (document.getElementById('extension-is-installed')) {
          this.setState({ screenShareEnabled: true });
        }
      }, 1000);
    }
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleShortcut, false);
  }

  handleShortcut(evt) {
    if (!this.props.chatOn) {
      let isSpace = false;
      let isV = false;
      let isM = false;

      if ('key' in evt) {
        isSpace = (evt.code === 'Space' || evt.key === ' ');
        isV = (evt.code === 'KeyV' || evt.key === 'v');
        isM = (evt.code === 'KeyM' || evt.key === 'm');
      } else {
        isSpace = (evt.keyCode === 32);
        isV = (evt.keyCode === 86);
        isM = (evt.keyCode === 77);
      }

      if (isSpace) { this.toggleMic(); }
      if (isV) { this.toggleVideo(); }
      if (isM) { this.toggleAudio(); }
    }
  }

  toggleMic() {
    if (!this.props.micOn) {
      this.props.webrtc.unmute();
    } else {
      this.props.webrtc.mute();
    }

    this.props.setData(CONSTANTS.SET_MIC_ON, !this.props.micOn);
    if (this.props.settings.sfxOn) this.clickSfx.play();
  }

  toggleVideo() {
    if (!this.props.videoOn) {
      this.props.webrtc.resumeVideo();
    } else {
      this.props.webrtc.pauseVideo();
    }

    this.props.setData(CONSTANTS.SET_VIDEO_ON, !this.props.videoOn);
    if (this.props.settings.sfxOn) this.clickSfx.play();
  }

  toggleAudio() {
    if (!this.props.audioOn) {
      this.props.webrtc.setVolumeForAll(1);
    } else {
      this.props.webrtc.setVolumeForAll(0);
    }

    this.props.setData(CONSTANTS.SET_AUDIO_ON, !this.props.audioOn);
    if (this.props.settings.sfxOn) this.clickSfx.play();
  }

  checkScreenShareExtension() {
    if (document.getElementById('extension-is-installed')) {
      this.setState({ screenShareEnabled: true });
      this.toggleScreenShare();
    } else {
      chrome.webstore.install(null, () => {
        this.setState({ screenShareEnabled: true });
        const isInstalledNode = document.createElement('div');
        isInstalledNode.id = 'extension-is-installed';
        document.body.appendChild(isInstalledNode);
        this.toggleScreenShare();
      }, (error) => {
        this.props.setNotification({ message: error, type: 'error' });
      });
    }
  }

  toggleScreenShare() {
    if (this.props.webrtc.getLocalScreen()) {
      this.setState({ screenShareOn: false });
      this.props.webrtc.stopScreenShare();
    } else {
      this.props.webrtc.shareScreen((err) => {
        if (err) {
          this.props.setNotification({ message: err, type: 'error' });
        } else {
          this.setState({ screenShareOn: true });
        }
      });
    }
  }

  resetScreenShare() {
    this.setState({ screenShareOn: false });
  }

  uploadFile() {
    this.setState({ uploading: !this.state.uploading });
  }

  render() {
    return (
      <section className="controls">
        <div className={`item tooltip ${this.props.micOn ? 'on' : 'off'}`} onClick={this.toggleMic} onMouseEnter={() => { if (this.props.settings.sfxOn) this.hoverSfx.play(); }}>
          <span className="tooltip-text top">&apos;space&apos; toggles your mic</span>
          {this.props.micOn ? <Icon glyph={MicOn} />
          : <Icon glyph={MicOff} />}
        </div>
        <div className={`item tooltip ${this.props.videoOn ? 'on' : 'off'}`} onClick={this.toggleVideo} onMouseEnter={() => { if (this.props.settings.sfxOn) this.hoverSfx.play(); }}>
          <span className="tooltip-text top">&apos;v&apos; toggles your video</span>
          {this.props.videoOn ? <Icon glyph={VideoOn} />
          : <Icon glyph={VideoOff} />}
        </div>
        <div className={`item tooltip ${this.props.audioOn ? 'on' : 'off'}`} onClick={this.toggleAudio} onMouseEnter={() => { if (this.props.settings.sfxOn) this.hoverSfx.play(); }}>
          <span className="tooltip-text top">&apos;m&apos; toggles all peers&apos; audio</span>
          {this.props.audioOn ? <Icon glyph={AudioOn} />
          : <Icon glyph={AudioOff} />}
        </div>
        {this.props.webrtc && !this.state.screenShareOn ?
          <div className={`item tooltip ${this.state.screenShareEnabled ? 'on' : 'off'}`} onClick={this.checkScreenShareExtension} onMouseEnter={() => { if (this.props.settings.sfxOn) this.hoverSfx.play(); }}>
            <span className="tooltip-text top">share your screen</span>
            {this.state.screenShareEnabled ? <Icon glyph={ScreenOn} />
            : <Icon glyph={ScreenOff} />}
          </div>
        : null}
        {/* <div className="item off" onClick={this.uploadFile} onMouseEnter={() => { if (this.props.settings.sfxOn) this.hoverSfx.play(); }}>
          <Icon glyph={Upload} />
        </div> */}
      </section>
    );
  }
}

const mapStateToProps = ({
  mainReducer: {
    micOn,
    videoOn,
    audioOn,
    chatOn,
    settings
  }
}) => ({
  micOn,
  videoOn,
  audioOn,
  chatOn,
  settings
});

const mapDispatchToProps = {
  setData,
  setNotification
};

export default connect(mapStateToProps, mapDispatchToProps, null, { withRef: true })(Controls);
