import React, { Component } from 'react';

class Statistics extends Component {

  componentDidMount() {
    this.props.setLoading(false);
  }

  render() {
    return (
      <section className="page statistics">
        Under construction
      </section>
    );
  }
}

export default Statistics;
