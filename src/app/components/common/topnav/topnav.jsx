import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as CONSTANTS from '../../../constants/constants';
import Navigation from '../navigation/navigation';
import Helpers from '../helpers';
import LinkCustom from '../lib/link/link';
import Icon from '../lib/icon/icon';
import FavouriteOff from '../../../assets/svg/favourite-off.svg';
import FavouriteOn from '../../../assets/svg/favourite-on.svg';
import Fingertips from '../../../assets/svg/icon-back2fingertips.svg';
import Logout from '../../../assets/svg/icon-logout.svg';
import Avatar from '../../../assets/svg/avatar.svg';
import Room from '../../../assets/svg/room.svg';

class TopNav extends Component {

  static toggleNav() {
    const sideNav = document.getElementById('sidenav');
    if (!sideNav.classList.contains('opened')) {
      TopNav.openNav();
    } else {
      TopNav.closeNav();
    }
  }

  static openNav() {
    const sideNav = document.getElementById('sidenav');
    const overlay = document.getElementById('overlay');
    const navIcon = document.getElementById('nav-icon');

    if (!sideNav.classList.contains('opened')) {
      sideNav.classList.remove('opened');
      overlay.style.display = 'block';
      Helpers.animate(overlay, 'fade-in');
      sideNav.classList.add('opened');
      sideNav.classList.remove('closed');
      navIcon.classList.add('opened');
    }
  }

  static closeNav() {
    const sideNav = document.getElementById('sidenav');
    const overlay = document.getElementById('overlay');
    const navIcon = document.getElementById('nav-icon');

    if (sideNav.classList.contains('opened')) {
      sideNav.classList.remove('opened');
      sideNav.classList.add('closed');
      Helpers.animate(overlay, 'fade-out', () => {
        overlay.style.display = 'none';
      });
      navIcon.classList.remove('opened');
    }
  }

  static handleEscKey(evt) {
    let isEscape = false;

    if ('key' in evt) {
      isEscape = (evt.key === 'Escape' || evt.key === 'Esc');
    } else {
      isEscape = (evt.keyCode === 27);
    }

    if (isEscape) {
      TopNav.closeNav();
    }
  }

  constructor(props) {
    super(props);

    this.state = {
      isFavourite: false,
      favourites: JSON.parse(localStorage.getItem(CONSTANTS.FAVOURITES_STORAGE)) || []
    };

    this.toggleFavourite = this.toggleFavourite.bind(this);
    this.checkIsFavourite = this.checkIsFavourite.bind(this);
  }

  componentDidMount() {
    document.addEventListener('keydown', TopNav.handleEscKey.bind(this), false);
  }

  componentWillReceiveProps(newProps) {
    if (!this.props.historyLocation || newProps.historyLocation.pathname !== this.props.historyLocation.pathname) {
      this.setState({ isFavourite: (this.checkIsFavourite(newProps) >= 0) });
    }
  }

  checkIsFavourite(props) {
    const favs = JSON.parse(localStorage.getItem(CONSTANTS.FAVOURITES_STORAGE));
    const fav = props.params.room;

    if (favs && favs.length > 0) {
      this.setState({ favourites: favs });
      return favs.indexOf(fav);
    }
    return -1;
  }

  toggleFavourite() {
    if (this.props.params.room) {
      this.setState({ isFavourite: !this.state.isFavourite }, () => {
        let favs = JSON.parse(localStorage.getItem(CONSTANTS.FAVOURITES_STORAGE));
        const fav = this.props.params.room;

        if (favs && favs.length > 0) {
          const found = favs.indexOf(fav);

          if (this.state.isFavourite && found === -1) {
            favs.push(fav);
          }

          if (!this.state.isFavourite && found >= 0) {
            favs.splice(found, 1);
          }
        } else {
          favs = [];
          if (this.state.isFavourite) {
            favs.push(fav);
          }
        }

        localStorage.setItem(CONSTANTS.FAVOURITES_STORAGE, JSON.stringify(favs));
        this.setState({ favourites: favs });
      });
    }
  }

  render() {
    return (
      <section id="top-nav" className="top-nav">
        <div className="top-nav-bar">
          <button
            id="nav-icon"
            className="top-nav-item nav-icon"
            onClick={() => { TopNav.toggleNav(); }}
            aria-label="toggle nav"
            aria-labelledby="top-nav"
          >
            <span />
            <span />
            <span />
            <span />
          </button>

          <div className="favourite" onClick={this.toggleFavourite}>
            {this.state.isFavourite ? <Icon glyph={FavouriteOn} /> : <Icon glyph={FavouriteOff} />}
          </div>

          <div className="room-name">
            <Icon glyph={Room} />
            {this.props.params.room || 'home'}
            {this.state.favourites && this.state.favourites.length > 0 ?
              <ul className="favourites-list">
                {this.state.favourites.map(item => (<li key={`favourite-${Helpers.makeid()}`}>
                  {item === this.props.params.room ? item : <LinkCustom to={`/${item}`}>{item}</LinkCustom>}
                </li>))}
              </ul>
            : null}
          </div>

          <LinkCustom to="/" title="Go to the Home page">
            <span className="logo">Stand<span>up</span></span>
          </LinkCustom>

          <div className="user-controls">
            <div className="user-settings" onClick={this.props.toggleSettings}>
              <span className="username">{this.props.header.data[0] && this.props.header.data[0].attributes.name
                ? this.props.header.data[0].attributes.name
                : (this.props.settings && this.props.settings.username) || 'User'}
              </span>
              {this.props.header.data[0] && this.props.header.data[0].attributes.avatarUrl
                ? <img className="avatar" alt="" src={this.props.header.data[0].attributes.avatarUrl} />
                : <Icon glyph={Avatar} className="icon avatar" />}
            </div>
            <a
              className="container-url"
              href={this.props.header.data[0]
                ? `${this.props.header.data[0].attributes.containerUrl}`
                : '#'}
            >
              <Icon glyph={Fingertips} className="icon fingertips" />
            </a>
            <a
              className="logout-url"
              href={this.props.header.data[0]
                ? `${this.props.header.data[0].attributes.logoutUrl}`
                : '#'}
            >
              <Icon glyph={Logout} className="icon logout" />
            </a>
          </div>
        </div>
        <Navigation toggleNav={TopNav.toggleNav} />
        <button
          id="overlay"
          className="overlay"
          onClick={() => { TopNav.closeNav(); }}
          aria-label="overlay"
          aria-labelledby="top-nav"
        />
      </section>
    );
  }
}

const mapStateToProps = ({
  api: {
    header = {
      data: []
    }
  },
  mainReducer: {
    settings,
    historyLocation
  }
}) => ({
  header,
  settings,
  historyLocation
});

const mapDispatchToProps = null;

export default connect(mapStateToProps, mapDispatchToProps)(TopNav);
