import React, { Component } from 'react';
import { connect } from 'react-redux';
import SimpleWebRTC from 'simplewebrtc';
import Helmet from 'react-helmet';
import { setNotification } from '../../actions/actions';
import * as CONSTANTS from '../../constants/constants';
import LocalVideo from '../common/video/localVideo';
import Video from '../common/video/video';
import Chat from '../chat/chat';
import Controls from '../controls/controls';
import Icon from '../common/lib/icon/icon';
import Waves from '../../assets/svg/waves.svg';

class Home extends Component {

  constructor(props) {
    super(props);

    this.state = {
      videos: [],
      fullScreen: false
    };
  }

  componentDidMount() {
    this.props.setLoading(false);
    this.init();
  }

  componentWillReceiveProps(newProps) {
    if (newProps.params.room !== this.props.params.room) {
      this.webrtc.leaveRoom();
      this.webrtc.joinRoom(newProps.params.room);
    }
  }

  componentWillUnmount() {
    this.destroy();
  }

  setMuted(mute, type, id) {
    this.state.videos.forEach((item, i) => {
      if (item.id === id) {
        const videos = this.state.videos;
        if (type === 'audio') videos[i].micOn = !mute;
        if (type === 'video') videos[i].videoOn = !mute;
        this.setState({ videos });
      }
    });
  }

  setVolume(volume, id) {
    const newVal = (-120 + (volume * -1)) / 100;
    let scale = 1;

    if (newVal < -0.2) { scale = 0.8 - newVal; }

    if (id === 'local-volume' && this.localVideo) {
      if (this.props.micOn) this.localVideo.getWrappedInstance().localVolume.style.transform = `scale(${scale}, ${scale})`;
    } else {
      this.state.videos.forEach((item, i) => {
        if (item.id === id) {
          const videos = this.state.videos;
          videos[i].volume = scale;
          this.setState({ videos });
        }
      });
    }
  }

  init() {
    this.webrtc = new SimpleWebRTC({
      localVideoEl: 'local-video',
      remoteVideosEl: '',
      autoRequestMedia: true,
      nick: (this.props.settings && this.props.settings.username) || `User ${Math.floor(Math.random() * 1000) + 1}`,
      url: 'https://fingertips-standup.herokuapp.com/',
      detectSpeakingEvents: false,
      debug: false,
      media: {
        audio: true,
        video: {
          width: { max: 100 },
          height: { max: 100 },
          frameRate: { max: 15 },
          facingMode: 'user'
        }
      }
    });

    this.webrtc.on('readyToCall', () => {
      this.webrtc.joinRoom(this.props.params.room);
    });

    this.webrtc.on('localStream', () => {
      if (!this.props.micOn) this.webrtc.mute();
      if (!this.props.videoOn) this.webrtc.pauseVideo();
    });

    this.webrtc.on('videoAdded', (video, peer) => {
      const videos = this.state.videos;
      videos.push({
        el: video,
        id: peer.id,
        streamId: peer.stream.id,
        pc: peer.pc,
        nick: peer.nick,
        micOn: true,
        videoOn: true,
        typing: false,
        typingTimeout: null,
        toggleFullScreen: state => this.toggleFullScreen(state)
      });
      this.setState({ videos });
    });

    this.webrtc.on('videoRemoved', (video, peer) => {
      this.state.videos.forEach((item, i) => {
        if (item.id === peer.id || item.streamId === peer.stream.id) {
          const videos = this.state.videos;
          videos.splice(i, 1);
          this.setState({ videos });
        }
      });
    });

    // Changes in local and remote volume
    // this.webrtc.on('volumeChange', (volume) => {
    //   this.setVolume(volume, 'local-volume');
    // });

    // this.webrtc.on('remoteVolumeChange', (peer, volume) => {
    //   if (volume) { this.setVolume(volume, peer.id); }
    // });

    // Changes in remote video or audio states
    this.webrtc.on('mute', (data) => {
      this.webrtc.getPeers(data.id).forEach((peer) => {
        if (data.name === 'audio') { this.setMuted(true, 'audio', peer.id); }
        if (data.name === 'video') { this.setMuted(true, 'video', peer.id); }
      });
    });

    this.webrtc.on('unmute', (data) => {
      this.webrtc.getPeers(data.id).forEach((peer) => {
        if (data.name === 'audio') { this.setMuted(false, 'audio', peer.id); }
        if (data.name === 'video') { this.setMuted(false, 'video', peer.id); }
      });
    });

    this.webrtc.on('channelMessage', (peer, channel, data) => {
      // We want label "hark" to be ignored, as it fires continiously
      if (channel === 'hark') { return true; }
      if (channel === 'chat') {
        if (data.type === 'message') {
          this.chat.getWrappedInstance().addNewMessage(false, peer.id, data.payload);
        } else if (data.type === 'typing') {
          this.updateTyping(true, peer.id);
        }
      }
      return true;
    });

    this.webrtc.on('iceFailed', (peer) => {
      this.props.setNotification({ message: `ICE failed on ${peer.nick}`, type: 'error' });
    });

    this.webrtc.on('connectivityError', (peer) => {
      this.props.setNotification({ message: `${peer.nick} has a connectivity error`, type: 'error' });
    });

    this.webrtc.on('localScreenAdded', (video) => {
      document.getElementById('local-video').appendChild(video);
    });

    this.webrtc.on('localScreenStopped', () => {
      document.getElementById('localScreen').remove();
      this.webrtc.stopScreenShare();
      this.controls.getWrappedInstance().resetScreenShare();
    });
  }

  destroy() {
    if (this.webrtc) {
      this.webrtc.leaveRoom();
      this.webrtc.disconnect();
      this.webrtc = null;
    }
  }

  updateTyping(state, id) {
    const videos = this.state.videos;
    for (let i = 0; i < this.state.videos.length; i += 1) {
      if (videos[i].id === id) {
        if (videos[i].typingTimeout) { clearTimeout(videos[i].typingTimeout); }
        videos[i].typing = state;
        videos[i].typingTimeout = state ? setTimeout(() => this.updateTyping(false, id), 1000) : null;
      }
    }
    this.setState({ videos });
  }

  toggleFullScreen(state) {
    this.setState({ fullScreen: state });
  }

  render() {
    return (
      <section className="room">
        <Controls webrtc={this.webrtc} ref={(controls) => { this.controls = controls; }} />
        <div className={`videos-wrapper ${this.state.fullScreen ? 'full-screen' : 'circles'}`}>
          <LocalVideo ref={(video) => { this.localVideo = video; }}>
            <div id="local-video" />
          </LocalVideo>
          <div id="remote-videos">
            {this.state.videos.map(video => <Video key={video.streamId} {...video} />)}
          </div>
          <Icon glyph={Waves} className="waves wave1" />
          <Icon glyph={Waves} className="waves wave2" />
        </div>
        <Chat ref={(chat) => { this.chat = chat; }} webrtc={this.webrtc} videos={this.state.videos} />
        <Helmet title={`${this.props.params.room} | ${CONSTANTS.APP_NAME}`} />
      </section>
    );
  }
}

const mapStateToProps = ({
  mainReducer: {
    settings,
    micOn,
    videoOn
  }
}) => ({
  settings,
  micOn,
  videoOn
});

const mapDispatchToProps = {
  setNotification
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
