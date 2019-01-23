import React, { Component } from 'react';
import CustomLink from '../lib/link/link';

class Navigation extends Component {

  constructor(props) {
    super(props);

    this.state = {
    };
  }

  render() {
    return (
      <nav id="navigation" className="navigation">
        <div id="sidenav" className="sidenav">
          <div className="nav-scroll">
            <ul className="nav-items">
              <li className="nav-item">
                <CustomLink to="/about" onClick={this.props.toggleNav}>About</CustomLink>
              </li>
              <li className="nav-item">
                <CustomLink to="/agile-scrum" onClick={this.props.toggleNav}>Agile &amp; Scrum</CustomLink>
              </li>
              <li className="nav-item">
                <CustomLink to="/rules" onClick={this.props.toggleNav}>Standup rules</CustomLink>
              </li>
              <li className="nav-item">
                <CustomLink to="statistics" onClick={this.props.toggleNav}>Statistics</CustomLink>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    );
  }
}

export default Navigation;
