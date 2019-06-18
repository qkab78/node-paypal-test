const paypal = require('paypal-rest-sdk');
const clientId = process.env.PAYPAL_CLIENT_ID || '';
const clientSecret = process.env.PAYPAL_CLIENT_SECRET || '';
const port = process.env.PORT || 5000;

paypal.configure({
    'mode': 'sandbox', //sandbox or live
    'client_id': clientId,
    'client_secret': clientSecret
});

exports.getIndex = (req, res) => {
    res.render('index')
}

exports.pay = (req, res) => {
    const create_payment_json = {
        "intent": "sale",
        "payer": {
            "payment_method": "paypal"
        },
        "redirect_urls": {
            "return_url": `http://localhost:${port}/success`,
            "cancel_url": `http://localhost:${port}/cancel`
        },
        "transactions": [{
            "item_list": {
                "items": [{
                    "name": "Casque Audio",
                    "sku": "001",
                    "price": "25.00",
                    "currency": "EUR",
                    "quantity": 1
                }]
            },
            "amount": {
                "currency": "EUR",
                "total": "25.00"
            },
            "description": "Le meilleur casque audio sur le marché."
        }]
    };

    paypal.payment.create(create_payment_json, function (error, payment) {
        if (error) {
            throw error;
        } else {
            for(let i = 0; i < payment.links.length; i++){
                if(payment.links[i].rel === 'approval_url'){
                    res.redirect(payment.links[i].href);
                }
            }
        }
    });

}

exports.resSuccess = (req, res) => {
    const payerId = req.query.PayerID;
    const paymentId = req.query.paymentId;

    const execute_payment_json = {
        "payer_id": payerId,
        "transactions": [{
            "amount": {
                "currency": "EUR",
                "total": "25.00"
            }
        }]
    };
    paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
        if (error) {
            console.log(error.response);
            throw error;
        } else {
            console.log("Get Payment Response");
            console.log(JSON.stringify(payment));
            res.send('success');
        }
    });
}

exports.resCancel = (req, res) => {
    res.send('cancel');
}