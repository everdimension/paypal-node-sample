const paypal = require('paypal-rest-sdk');

paypal.configure({
  mode: 'sandbox',
  client_id: process.env.PAYPAL_CLIENT_ID,
  client_secret: process.env.PAYPAL_CLIENT_SECRET,
});

const paymentConfig = {
  intent: "sale",
  payer: {
    payment_method: "paypal",
  },
  redirect_urls: {
    return_url: "localhost:3000/api/payWithPaypal/success",
    cancel_url: "localhost:3000/api/payWithPaypal/fail",
  },
  transactions: [{
    item_list: {
      items: [{
        name: "payment for like",
        sku: "like_0001",
        price: "1.00",
        currency: "USD",
        quantity: 1,
      }],
    },
    amount: {
      currency: "USD",
      total: "1.00",
    },
    description: "This is the payment description.",
  }],
};

module.exports = function (app) {
  app.post('/api/payWithPaypal', (req, res) => {
    paypal.payment.create(paymentConfig, (err, payment) => {
      if (err) {
        console.log('payment error', err);
        throw err;
      }

      const redirectLink = payment.links.find(l => l.rel === 'approval_url');
      if (!redirectLink) {
        console.log('no approval_url');
        res.send('no redirectLink... :(');
        throw err;
      }
      const { href } = redirectLink;
      console.log('approval_url', href);
      res.send({ approval_url: href });
    });
  });

  app.get('/api/payWithPaypal/success', (req, res) => {
    console.log('should execute payment');
    res.send('ok');
  });
};
