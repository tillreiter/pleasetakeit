'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Item = mongoose.model('Item'),
    _ = require('lodash');


/**
 * Find item by id
 */
exports.item = function(req, res, next, id) {
    Item.load(id, function(err, item) {
        if (err) return next(err);
        if (!item) return next(new Error('Failed to load item ' + id));
        req.item = item;
        next();
    });
};

/**
 * Create an item
 */


exports.create = function(req, res) {
    var item = new Item(req.body);

    //it does not work like this - you are setting up the new item with the req.body above. it puts all the stuff it gets from the query into the new item.
    // item.active = true;
    // item.pic_url = req.item_pic_url;
    // item.title = req.item_title;
    // item.category = req.item_category;
    // item.location = req.item_location;
    // item.time = req.item_time;
    // item.owner = req.owned_by;


    item.save(function(err) {
        if (err) {
            //not sure where to send user if failed to save item.
            return res.send('users/signup', {
                errors: err.errors,
                item: item
            });
        } else {
            res.jsonp(item);
        }
    });
};

/**
 * Update an article
 */
exports.update = function(req, res) {
    var item = req.item;

    item = _.extend(item, req.body);

    item.save(function(err) {
        if (err) {
            return res.send('users/signup', {
                errors: err.errors,
                item: item
            });
        } else {
            res.jsonp(item);
        }
    });
};

/**
 * Delete an article
 */
exports.destroy = function(req, res) {
    var item = req.item;

    item.remove(function(err) {
        if (err) {
            return res.send('users/signup', {
                errors: err.errors,
                item: item
            });
        } else {
            res.jsonp(item);
        }
    });
};

/**
 * Show an article
 */
exports.show = function(req, res) {
    res.jsonp(req.item);
};

/**
 * List of Articles
 */
exports.all = function(req, res) {
    Item.find().sort('-created').populate('user', 'name username').exec(function(err, items) {
        if (err) {
            res.render('error', {
                status: 500
            });
        } else {
            res.jsonp(items);
        }
    });
};
