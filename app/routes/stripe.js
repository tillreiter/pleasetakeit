'use strict';

// User routes use users controller
var stripe = require('../controllers/stripe');

module.exports = function(app, passport) {

    app.post('/deposit', stripe.deposit);

};
