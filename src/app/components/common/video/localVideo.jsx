import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as CONSTANTS from '../../../constants/constants';
import Icon from '../../common/lib/icon/icon';
import Helpers from '../../common/helpers';
import VideoOff from '../../../assets/svg/video-off.svg';

class LocalVideo extends Component {

  constructor(props) {
    super(props);

    this.hoverSfx = new Audio(`${CONSTANTS.ASSETS_PATH}mp3/hover.mp3`);
  }

  componentWillReceiveProps(newProps) {
    if (newProps.videoOn !== this.props.videoOn) {
      Helpers.animate(this.localWrapper, 'rubberBand');
    }
    if (newProps.micOn !== this.props.micOn) {
      Helpers.animate(this.localWrapper, 'tada');
    }
  }

  render() {
    return (
      <div id="local-video-wrapper" className="local-video-wrapper circle" onMouseEnter={() => { if (this.props.settings.sfxOn) this.hoverSfx.play(); }} ref={(item) => { this.localWrapper = item; }}>
        {this.props.micOn ? <div id="local-volume" ref={(item) => { this.localVolume = item; }} className="volume" /> : null}
        <div className={`video-overflow-wrapper ${this.props.micOn ? 'on' : 'off'}`}>
          {this.props.children}
          {!this.props.videoOn ? <Icon glyph={VideoOff} /> : null}
        </div>
        <div className="username">{(this.props.settings.username) || 'Me'}</div>
      </div>
    );
  }
}

const mapStateToProps = ({
  mainReducer: {
    micOn,
    videoOn,
    settings
  }
}) => ({
  micOn,
  videoOn,
  settings
});

const mapDispatchToProps = null;

export default connect(mapStateToProps, mapDispatchToProps, null, { withRef: true })(LocalVideo);
