/* eslint no-return-assign: "off" */
import React, { Component } from 'react';
import Helmet from 'react-helmet';
import debounce from 'lodash/debounce';
import { connect } from 'react-redux';
import {
  changeViewport,
  locationDidUpdate,
  setLoading,
  setSettings
} from '../actions/actions';
import Helpers from './common/helpers';
import { history } from '../store';
import * as CONSTANTS from '../constants/constants';
import Notification from './common/notification/notification';
import Settings from './settings/settings';
import TopNav from './common/topnav/topnav';
import BrowserDetection from './common/browserDetection/browserDetection';
import Loader from './common/loader/loader';

class App extends Component {

  static updateBodyClass(location) {
    // Update the body class dynamically with the path names
    const body = document.querySelector('body');
    let bodyClasses = Helpers.classify(location.pathname) || 'home';
    bodyClasses = bodyClasses.split(' ');
    body.className = '';
    bodyClasses.forEach((el) => {
      body.classList.add(el);
    });
  }

  constructor(props) {
    super(props);

    this.state = {
      settingsOpened: false
    };

    this.toggleSettings = this.toggleSettings.bind(this);
  }

  componentWillMount() {
    const settings = JSON.parse(localStorage.getItem(CONSTANTS.SETTINGS_STORAGE));
    if (settings) {
      const newSettings = { ...settings, micOn: false };
      this.props.setSettings(newSettings);
    }
    // apiHelpers.setup();
    // apiHelpers.start(this.props.location);
  }

  componentDidMount() {
    let isDesktop = window.innerWidth > 768;
    this.props.changeViewport(isDesktop);

    window.onresize = debounce(() => {
      isDesktop = window.innerWidth > 768;
      this.props.changeViewport(isDesktop);
    }, 500);

    this.unlisten = history.listen((location) => {
      this.props.locationDidUpdate(location);
      App.updateBodyClass(location);
    });

    this.props.locationDidUpdate(this.props.location);
    App.updateBodyClass(this.props.location);
  }

  toggleSettings() {
    this.setState({ settingsOpened: !this.state.settingsOpened });
  }

  render() {
    const title = this.props.routes[1].title
      ? `${this.props.routes[1].title} | ${CONSTANTS.APP_NAME}`
      : `${CONSTANTS.APP_NAME}`;

    return (
      <section className="app">
        <BrowserDetection />
        <Helmet title={String(title)} />
        <Loader isLoading={this.props.isLoading} />
        <TopNav toggleSettings={this.toggleSettings} location={this.props.location} params={this.props.params} />
        <Notification />
        <Settings opened={this.state.settingsOpened} toggleSettings={this.toggleSettings} />
        {React.cloneElement(this.props.children, this.props)}
      </section>
    );
  }
}

const mapStateToProps = ({
  mainReducer: {
    isDesktop,
    isLoading
  },
  api: {
    start = {
      data: []
    }
  }
}) => ({ isDesktop, isLoading, start });

const mapDispatchToProps = {
  changeViewport,
  setLoading,
  locationDidUpdate,
  setSettings
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
