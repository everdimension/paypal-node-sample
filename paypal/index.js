const paypal = require('paypal-rest-sdk');
const paypalConfig = require('./paypal-config-sandbox');

paypal.configure(paypalConfig);

const paymentConfigDefaults = {
  intent: "sale",
  payer: {
    payment_method: "paypal",
  },
  redirect_urls: {
    return_url: "http://0.0.0.0:3000/api/payWithPaypal/success",
    cancel_url: "http://0.0.0.0:3000/api/payWithPaypal/fail",
  },
  transactions: [{
    item_list: {
      items: [],
    },
    amount: {
      currency: "USD",
      total: null, // must set
    },
    description: "This is the payment description.",
  }],
};

function createPayment(req, res) {
  // maybe get details from database
  const paidItem = {
    name: "payment for like",
    sku: "like_0001",
    price: "1.00",
    currency: "USD",
    quantity: 1,
  };

  // copy config object
  const paymentConfig = Object.assign({}, paymentConfigDefaults);
  paymentConfig.transactions[0].item_list.items.push(paidItem);
  paymentConfig.transactions[0].amount.total = paidItem.price;

  paypal.payment.create(paymentConfig, (err, payment) => {
    if (err) {
      res.status(500).send({ errCode: 'paypal_payment_error' });
      throw err;
    }

    const redirectLink = payment.links.find(l => l.rel === 'approval_url');
    if (!redirectLink) {
      res.status(500).send({ errCode: 'approval_url_missing' });
      throw err;
    }

    // *****************************
    // save this paymentId for later
    // ----> const paymentId = payment.id;
    // *****************************

    res.send({ approval_url: redirectLink.href });
  });
}

function executePayment(req, res) {
  // ****************************
  // req.query.paymentId holds the paymentId which was created before
  // ****************************

  const { paymentId, PayerID } = req.query;
  if (!paymentId || !PayerID) {
    res.status(500).send({ errCode: 'important_stuff_missing' });
    throw 'paypal error';
  }

  const executePaymentConfig = {
    payer_id: PayerID,
  };
  paypal.payment.execute(paymentId, executePaymentConfig, (err, payment) => {
    if (err) {
      res.status(500).send({ errCode: "payment_execution_failed" });
    }

    res.redirect('/?success=true');
  });
}

function AddPaypalHandlers(app) {
  app.post('/api/payWithPaypal', createPayment);
  app.get('/api/payWithPaypal/success', executePayment);
};

module.exports = AddPaypalHandlers;
