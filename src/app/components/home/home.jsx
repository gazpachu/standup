import React, { Component } from 'react';
import { connect } from 'react-redux';
import { history } from '../../store';
import * as CONSTANTS from '../../constants/constants';
import Helpers from '../common/helpers';
import Icon from '../common/lib/icon/icon';
import Waves from '../../assets/svg/waves.svg';

class Home extends Component {

  constructor(props) {
    super(props);

    this.state = {
      roomId: ''
    };

    this.hoverSfx = new Audio(`${CONSTANTS.ASSETS_PATH}mp3/hover.mp3`);
    this.clickSfx = new Audio(`${CONSTANTS.ASSETS_PATH}mp3/click.mp3`);

    this.joinRoom = this.joinRoom.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    this.props.setLoading(false);
    this.roomName.focus();
  }

  handleChange(event) {
    this.setState({ roomId: event.target.value });
  }

  joinRoom(event) {
    event.preventDefault();
    if (this.props.settings.sfxOn) this.clickSfx.play();
    history.push(Helpers.slugify(this.state.roomId));
  }

  render() {
    return (
      <section className="home">
        <form className="room-selector" onSubmit={this.joinRoom}>
          <input ref={(item) => { this.roomName = item; }} type="text" placeholder="Enter room name" value={this.state.roomId} onChange={this.handleChange} />
          <button className="btn btn-primary" onMouseEnter={() => { if (this.props.settings.sfxOn) this.hoverSfx.play(); }} onClick={this.joinRoom}>Join room</button>
        </form>
        <div className="videos-wrapper">
          <Icon glyph={Waves} className="waves wave1" />
          <Icon glyph={Waves} className="waves wave2" />
        </div>
        <div className="app-version">Standup v{this.props.start.data[0] ? this.props.start.data[0].attributes.appVersion : '0.0.1'}</div>
      </section>
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

export default connect(mapStateToProps, mapDispatchToProps)(Home);
