import React, { Component } from 'react';
import About from '../content/about';
import Agile from '../content/agile';
import Rules from '../content/rules';

class Page extends Component {

  componentDidMount() {
    this.props.setLoading(false);
  }

  render() {
    const page = this.props.location.pathname;
    return (
      <section className="page">
        {page === '/about' ? <About /> : null}
        {page === '/agile-scrum' ? <Agile /> : null}
        {page === '/rules' ? <Rules /> : null}
      </section>
    );
  }
}

export default Page;
