'use strict';

// Articles routes use articles controller
var item = require('../controllers/giveititems');
var authorization = require('./middlewares/authorization');

// Article authorization helpers
var hasAuthorization = function(req, res, next) {
  if (req.item.owned_by.id !== req.owned_by.id) {
        return res.send(401, 'User is not authorized');
    }
    next();
};

module.exports = function(app) {

    app.get('/item', item.all);
    app.post('/item', authorization.requiresLogin, item.create);
    app.get('/item/:articleId', item.show);
    app.put('/item/:articleId', authorization.requiresLogin, hasAuthorization, item.update);
    app.del('/item/:articleId', authorization.requiresLogin, hasAuthorization, item.destroy);

    // Finish with setting up the articleId param
    app.param('articleId', item.article);

};
