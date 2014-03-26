'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Item = mongoose.model('Item'),
    _ = require('lodash');
    // Q = require('q');


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
    item.owned_by = req.user._id;

    // //1) Change location information into appropriate string to send to GoogleMaps API

    // var itemLocation = item.streetNumber.split(" ").join("+") + "+" + item.street.split(" ").join("+") + "+" + item.city.split(" ").join("+") + "+" + item.state.split(" ");
    // var requestString = "https://maps.googleapis.com/maps/api/geocode/json?address=" + itemLocation + "&sensor=false&key=AIzaSyAhAKz6iviBvxbLd7ZMjhkx_jaWToU9Kx4";

    // //2) set function to call geocoding API (translates to lat/long);
    // var geoCodeRequest = function(url) {
    // var deferred = Q.defer();
    // request.get(url, function(err, response, data) {
    //   if (!err) {
    //     var googleResponse = JSON.parse(data);
    //     deferred.resolve(googleResponse);
    //   }
    //   else {
    //     deferred.reject("There was an error! Status code: " + data.status + error);
    //   }
    // });
    //     return deferred.promise;
    // };
    // //3) Take response and parse it for latlng information
    // geoCodeRequest = function(requestString).then(function(data){
    //     var latLngObject = {latitude: data.results[0].geometry.location.lat, longitude: data.results[0].geometry.location.lng};
    //     console.log(latLngObject);
    // })

    // //4) set item's latlng value from parsed latlng
    // item.latlng = latLngObject;


    //

    //5) save item in Mongo
    item.save(function(err) {
        if (err) {
            //not sure where to send user if failed to save item.
            return res.send('users/signup', {
                errors: err.errors,
                item: item
            });
        } else {
            res.jsonp(item);
            console.log(item)
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
