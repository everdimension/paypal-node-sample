import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';

class App extends React.Component {
  constructor() {
    super();
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = { loading: false };
  }

  handleSubmit(evt) {
    evt.preventDefault();
    this.setState({ loading: true });
    fetch('/api/payWithPaypal', {
      method: 'POST'
    })
      .then(res => res.json())
      .then(res => {
        this.setState({ loading: false });
        window.location.href = res.approval_url;
      })
      .catch(err => {
        console.warn(err);
        this.setState({ loading: false });
      });
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        Paypal form
        <br />
        <br />
        <button
          style={{
            cursor: 'pointer',
            display: 'inline-block',
            backgroundColor: '#3f90d2',
            padding: '6px 12px',
            border: 'none',
            borderRadius: '2px',
            color: 'white',
            fontSize: '14px',
          }}
        >
          {this.state.loading ?
            'loading...' :
            'pay with paypal $$$'
          }
        </button>
      </form>
    );
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('app')
);
