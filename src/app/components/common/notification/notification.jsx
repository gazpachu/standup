import React, { Component } from 'react';
import { connect } from 'react-redux';
// import Honeybadger from 'honeybadger-js';
import Helpers from '../helpers';
import { setNotification } from '../../../actions/actions';
import Icon from '../lib/icon/icon';
import Success from '../../../assets/svg/success.svg';
import Error from '../../../assets/svg/error.svg';
import Info from '../../../assets/svg/info.svg';

const defaultProps = {
  notification: {
    message: '',
    type: ''
  }
};

class Notification extends Component {

  constructor(props) {
    super(props);

    this.slideInTimeout = null;
    this.slideOutTimeout = null;
  }

  componentWillReceiveProps(newProps) {
    if (newProps.notification.message !== '') {
      if (newProps.notification.message.indexOf('401') !== -1 || newProps.notification.message.toLowerCase().indexOf('unauthorised') !== -1 || newProps.notification.message.toLowerCase().indexOf('unauthorized') !== -1) {
        window.location.replace(this.props.header.data[0].attributes.containerUrl);
      } else {
        this.showNotification();
      }
    }
  }

  showNotification() {
    const el = document.getElementById('notification');

    // if (this.props.notification.type === 'error') {
    //   Honeybadger.notify(this.props.notification.message);
    // }

    clearTimeout(this.slideInTimeout);
    clearTimeout(this.slideOutTimeout);

    this.slideInTimeout = setTimeout(() => {
      el.style.display = 'block';
      Helpers.animate(el, 'slideInRight');
    }, 2000);

    this.slideOutTimeout = setTimeout(() => {
      Helpers.animate(el, 'slideOutRight', () => {
        el.style.display = 'none';
        this.props.setNotification(defaultProps.notification);
      });
    }, 4000);
  }

  render() {
    return (
      <section id="notification" className={`notification ${this.props.notification.type}`}>
        <Icon className="icon success-icon" glyph={Success} />
        <Icon className="icon error-icon" glyph={Error} />
        <Icon className="icon info-icon" glyph={Info} />
        <span className="message">{this.props.notification.message}</span>
      </section>
    );
  }
}

const mapDispatchToProps = {
  setNotification
};

const mapStateToProps = ({
  api: {
    header = {
      data: []
    }
  },
  mainReducer: {
    notification
  }
}) => ({
  header,
  notification
});

export default connect(mapStateToProps, mapDispatchToProps)(Notification);
