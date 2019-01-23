import React, { Component } from 'react';
import { connect } from 'react-redux';
import Toggle from 'react-toggle';
import * as CONSTANTS from '../../constants/constants';
import { setSettings } from '../../actions/actions';
import Icon from '../common/lib/icon/icon';
import Close from '../../assets/svg/x.svg';

class Settings extends Component {

  constructor(props) {
    super(props);

    this.state = {
      ...this.props.settings
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillReceiveProps(newProps) {
    if (newProps.opened !== this.props.opened) {
      this.setState({ ...this.props.settings });
    }
  }

  handleChange(event) {
    event.preventDefault();
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    this.setState({ [event.target.name]: value });
  }

  handleSubmit(event) {
    event.preventDefault();
    localStorage.setItem(CONSTANTS.SETTINGS_STORAGE, JSON.stringify(this.state));
    this.props.setSettings(this.state);
    window.location.reload(false);
  }

  render() {
    return (
      <section className={`settings ${this.props.opened ? 'opened' : ''}`}>
        <h2>Settings</h2>
        <button className="close" onClick={this.props.toggleSettings}><Icon glyph={Close} /></button>
        <div>
          <p>
            <label htmlFor="username">Username</label>
            <input type="text" name="username" value={this.state.username} onChange={this.handleChange} />
          </p>
          <p>
            <label htmlFor="quality">Video quality</label>
            <input type="range" min="50" max="100" name="quality" value={this.state.quality} className="slider" onChange={this.handleChange} />
            {this.state.quality}%
          </p>
          <div className="default-controls">
            <label htmlFor="mic">Default mic</label>
            <Toggle
              name="micOn"
              className="toggle"
              checked={this.state.micOn}
              onChange={this.handleChange}
            />
            <label htmlFor="mic">Default video</label>
            <Toggle
              name="videoOn"
              className="toggle"
              checked={this.state.videoOn}
              onChange={this.handleChange}
            />
            <label htmlFor="mic">Default audio</label>
            <Toggle
              name="audioOn"
              className="toggle"
              checked={this.state.audioOn}
              onChange={this.handleChange}
            />
          </div>
          <div className="sfx">
            <label htmlFor="sfx">Sound FX</label>
            <Toggle
              name="sfxOn"
              className="toggle"
              checked={this.state.sfxOn}
              onChange={this.handleChange}
            />
          </div>
          <p>
            <button className="btn btn-primary btn-save" onClick={this.handleSubmit}>Apply changes</button>
            <span>[reloads the app]</span>
          </p>
        </div>
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

const mapDispatchToProps = {
  setSettings
};

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
