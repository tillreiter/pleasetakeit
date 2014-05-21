'use strict';

// Articles routes use articles controller
var items = require('../controllers/items');
var authorization = require('./middlewares/authorization');

// Article authorization helpers
var hasAuthorization = function(req, res, next) {
  if (req.item.owned_by.id !== req.owned_by.id) {
        return res.send(401, 'User is not authorized');
    }
    next();
};

module.exports = function(app) {

    app.post('/payments', items.makePayment);

    app.get('/items', items.all);

    app.post('/items', authorization.requiresLogin, items.create);

    app.get('/items/:itemId', items.show);
    app.post('/items/:itemId/wantItem', items.want);
    app.post('/items/:itemId/unwantItem', items.unwant);

    // Buying item triggers email to Seller and Buyer
    app.post('/buy/:itemId', items.email);
    // // Giver's response leads to Finish Deal
    app.post('/sold/:itemId', items.dealSuccess)

    //services need to be set up according to what payment mechanism is getting used
    app.post('/deal/fail/:itemId', items.dealFail);
    app.post('/deal/success/:itemId', items.dealSuccess);

    // Finish with setting up the itemId param
    app.param('itemId', items.item);
};
