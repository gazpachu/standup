import React, { Component } from 'react';
import Helpers from '../helpers';
import Icon from '../lib/icon/icon';
import Chrome from '../../../assets/svg/chrome.svg';

class BrowserDetection extends Component {

  static closeBrowserDetectionBox() {
    const el = document.getElementById('browser-detection');
    Helpers.animate(el, 'fadeOut', () => {
      el.remove();
    });
  }

  constructor(props) {
    super(props);

    this.state = {
      status: 'hidden'
    };
  }

  componentDidMount() {
    this.checkIfIE();
  }

  checkIfIE() {
    const ua = window.navigator.userAgent;
    const msie = ua.indexOf('MSIE ');
    const trident = ua.indexOf('Trident/');
    const edge = ua.indexOf('Edge/');
    const el = document.getElementById('browser-detection');

    if (msie > 0 || trident > 0 || edge > 0) {
      this.setState({ status: '' });
      Helpers.animate(el, 'fadeIn');
    } else {
      el.remove();
    }
  }

  render() {
    return (
      <div id="browser-detection" className={`browser-detection ${this.state.status}`}>
        <div className="browser-box">
          <h4 className="message">This app has been optimised to work with Google Chrome. We can&#39;t guarantee all features will work using Internet Explorer! Please download and install Chrome.</h4>
          <button aria-label="download" aria-labelledby="browser-detection" className="btn btn-primary">
            <a href="https://www.google.com/chrome/browser/desktop/index.html"><Icon glyph={Chrome} />Download Chrome</a>
          </button>
          <button aria-label="cancel" aria-labelledby="browser-detection" className="btn btn-primary" onClick={BrowserDetection.closeBrowserDetectionBox}>Close</button>
        </div>
      </div>
    );
  }
}

export default BrowserDetection;
