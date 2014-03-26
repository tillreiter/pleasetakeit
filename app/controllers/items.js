'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Item = mongoose.model('Item'),
    _ = require('lodash'),
    Q = require('q'),
    request = require('request');


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

    //1) Change location information into appropriate string to send to GoogleMaps API

    var itemLocation = item.address.split(" ").join("+");
    var requestString = "https://maps.googleapis.com/maps/api/geocode/json?address=" + itemLocation + "&sensor=false";
    console.log(requestString);

    // //2) set function to call geocoding API (translates to lat/long);
    var geoCodeRequest = function(url) {
        var deferred = Q.defer();
        request.get(url, function(err, response, data) {
          if (!err) {
            var googleResponse = JSON.parse(data);
            deferred.resolve(googleResponse);
          }
          else {
            deferred.reject("There was an error! Status code: " + data.status + error);
          }
        });
            return deferred.promise;
    };
    // //3) Take response and parse it for latlng information
    var geoData = [];

    geoCodeRequest(requestString).then(function(data){
        console.log("are we getting here?");
        var latitude = data.results[0].geometry.location.lat;
        var longitude = data.results[0].geometry.location.lng;
        // latLngObject = {latitude: data.results[0].geometry.location.lat, longitude: data.results[0].geometry.location.lng};
        // console.log("Lat equals"+latitude);
        // console.log("long equals"+longitude);
        // geoData.push(latitude, longitude);
        item.latlng.latitude = latitude;
        item.latlng.longitude = longitude;
        item.save(function(err) {
            if (err) {
                return res.send('users/signup', {
                    errors: err.errors,
                    item: item
                });
            } else {
                res.jsonp(item);
                console.log(item)
            }
        });

    })

    // //4) set item's latlng value from parsed latlng

    //5) save item in Mongo
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
