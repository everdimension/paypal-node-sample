import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import jsonResponseHandler from './jsonResponseHandler';
import Success from './Success';

class App extends React.Component {
  constructor() {
    super();
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
      loading: false,
      redirecting: false,
      isSuccess: false,
    };
  }

  componentWillMount() {
    this.setState({
      isSuccess: window.location.search.indexOf('success') !== -1,
    });
  }

  handleSubmit(evt) {
    evt.preventDefault();
    this.setState({ loading: true });
    fetch('/api/payWithPaypal', {
      method: 'POST'
    })
      .then(jsonResponseHandler)
      .then(res => {
        this.setState({ loading: false, redirecting: true });
        window.location.href = res.approval_url;
      })
      .catch(err => {
        console.warn(err);
        this.setState({ loading: false });
        throw err;
      });
  }

  render() {
    if (this.state.isSuccess) {
      return <Success />
    }
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
            'pay with paypal $1'
          }
        </button>
        {this.state.redirecting ?
          <p>Redirecting to paypal...</p> :
          null
        }
      </form>
    );
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('app')
);
