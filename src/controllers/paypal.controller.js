const paypal = require('paypal-rest-sdk');

paypal.configure({
  mode: 'sandbox', //sandbox or live
  client_id: process.env.CLIENT_ID,
  client_secret: process.env.CLIENT_SECRET,
});

exports.createPayment = (req, res) => {
  const create_payment_json = {
    intent: 'authorize',
    payer: {
      payment_method: 'paypal',
    },
    redirect_urls: {
      return_url: 'http://127.0.0.1:8080/api/paypal/success',
      cancel_url: 'http://127.0.0.1:8080/api/paypal/cancel',
    },
    transactions: [
      {
        item_list: {
          items: [
            {
              name: 'item',
              sku: 'item',
              price: '1.00',
              currency: 'USD',
              quantity: 1,
            },
          ],
        },
        amount: {
          currency: 'USD',
          total: '1.00',
        },
        description: 'This is the payment description.',
      },
    ],
  };
  paypal.payment.create(create_payment_json, function (error, payment) {
    if (error) {
      console.log(error.response);
      throw error;
    } else {
      for (var index = 0; index < payment.links.length; index++) {
        //Redirect user to this endpoint for redirect url
        if (payment.links[index].rel === 'approval_url') {
          res.redirect(payment.links[index].href);
        }
      }
      console.log(payment);
    }
  });
};

exports.successPayment = (req, res) => {
  const PayerID = req.query.PayerID;
  const execute_payment_json = {
    payer_id: PayerID,
    transactions: [
      {
        amount: {
          currency: 'USD',
          total: '1.00',
        },
      },
    ],
  };
  const paymentId = req.query.paymentId;
  paypal.payment.execute(
    paymentId,
    execute_payment_json,
    function (error, payment) {
      if (error) {
        console.log(error.response);
        throw error;
      } else {
        console.log('Get Payment Response');
        res.send(payment);
      }
    }
  );
};
