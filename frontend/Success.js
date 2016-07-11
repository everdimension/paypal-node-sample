import React from 'react';

class Success extends React.Component {
  render() {
    return (
      <div
        style={{
          maxWidth: 450,
          padding: '10px 20px',
          backgroundColor: '#53ba4e',
          color: 'white',
          fontSize: '16px',
        }}
      >
        Paypal payment completed successfully
      </div>
    );
  }
}

export default Success;
