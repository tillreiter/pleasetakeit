'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Item = mongoose.model('Item'),
    User = mongoose.model('User'),
    Payment = mongoose.model('Payment'),
    _ = require('lodash'),
    Q = require('q'),
    request = require('request'),
    fs = require('fs'),
    AWS = require('aws-sdk'),
    mailer = require('../lib/mail'),
    balanced = require('balanced-official');


//loading access S3 access keys
AWS.config.loadFromPath(__dirname + '/aws.json')

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
    //create endTime
    var timeFinish = Date.now() + 1000*3600*item.duration;
    item.endTime = new Date(timeFinish);

    item.owned_by = req.user;

    //make sure form's input field is called "image"
    var file = req.files.picture;
    var filePath = file.path;

    //upload file to s3
    fs.readFile(filePath, function(err, data) {
        if (err) { throw err; }

        var s3 = new AWS.S3({ params: {Bucket: 'PleaseTakeIt', Key: file.name }});
        s3.putObject({
            Body: data
        }, function() {
            console.log('UPLOADED');
            //Set file path to URL in ItemSchema (baseURL+file.name)
            // console.log("the filename is", file.name);
            item.picture = "http://s3.amazonaws.com/PleaseTakeIt/" + file.name;

            // Geocode
            //1) Change location information into appropriate string to send to GoogleMaps API
            var itemLocation = item.address.split(" ").join("+");
            var requestString = "https://maps.googleapis.com/maps/api/geocode/json?address=" + itemLocation + "&sensor=false";

            //2) set function to call geocoding API (translates to lat/long);
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

            //3) Take response and parse it for latlng information
            geoCodeRequest(requestString).then(function(data){
                // console.log("are we getting here?");
                var latitude = data.results[0].geometry.location.lat;
                var longitude = data.results[0].geometry.location.lng;

                item.lnglat = [longitude, latitude];
                item.save(function(err) {
                    if (err) {
                        return res.send('creating new item failed', {
                            errors: err.errors,
                            item: item
                        });
                    } else {
                        res.send(JSON.stringify(item));
                    }
                });

            })
        });
    });

};

/**
 * Update an item
 */
exports.update = function(req, res) {
    var updatedItem = req.body;

    Item.findOne({_id: updatedItem._id}, function (err, foundItem){

        if (typeof updatedItem.owned_by !== 'String'){
            updatedItem.owned_by = updatedItem.owned_by._id
        };
        if (!!updatedItem.bought_by && typeof updatedItem.bought_by !== 'String'){
            updatedItem.bought_by = updatedItem.bought_by._id
        };
        if (foundItem.wanted_by && typeof updatedItem.wanted_by == 'string') {
            updatedItem.wanted_by = _.union([updatedItem.wanted_by], foundItem.wanted_by);
            foundItem = _.extend(foundItem, updatedItem);
        }
        else {
            foundItem = _.extend(foundItem, updatedItem);
        };

        foundItem.save(function(err) {
            if (err) {
                return res.send('not updating item', {
                    errors: err.errors,
                });
            } else {
                console.log('updating item');
                res.jsonp(foundItem);
            }
        });
    })
};

//Save an item to wishlist
exports.want = function (req, res) {
    var userId = req.body.userId;
    var item = req.item;
    Item.findOneAndUpdate({_id: req.item._id}, {$push: { wanted_by: userId }}, function (err, res) {
        console.log(res.title + "added to wishlist")
    })
}


//Delete an item from wishlist
exports.unwant = function (req, res) {
    var userId = req.body.userId;
    var item = req.item;
    Item.findOneAndUpdate({_id: req.item._id}, {$pull: { wanted_by: userId }}, function (err, res) {
        console.log(res.title + " removed from wishlist")
    })
}



/**
 * Delete an item
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


// Show one item
exports.show = function(req, res) {
    Item.findOne({_id: req.item._id}).populate('owned_by').populate('bought_by').exec(function(err, item) {
                if (err) {
                    res.render('error', {
                        status: 500
                    });
                } else {
                    console.log("sending single item")
                    res.jsonp(item);
            }
        })
};


// Exporting items according to certain request criteria
exports.all = function(req, res) {
    // find items by distance
    if (req.query.itemRadius) {
        var miles = req.query.itemRadius;
        var userLng = req.user.lnglat[0];
        var userLat = req.user.lnglat[1];
        var userCoord = [userLng, userLat]

        Item.find({lnglat:
           {$near: userCoord,
            $maxDistance:miles/69.17}
        }).populate('owned_by', 'name.first name.last username _id').exec(function(err, items){
                console.log('sending back items in certain radius');
                res.jsonp(items);
            });
    }
    // find items on wishlist
    else if (req.query.wantedItemsUserId) {
        var wantedByUser = req.query.wantedItemsUserId;
        Item.find({wanted_by: wantedByUser}).populate('owned_by', 'name.first name.last username _id').exec(function(err, items) {
                if (err) {
                    res.render('error', {
                        status: 500
                    });
                } else {
                    console.log("Sending items on user's wishlist")
                    res.jsonp(items);
            }
        })
    }
    // find owned (to sell) items by user
    else if (req.query.ownedItemsUserId) {
        var ownedByUser = req.query.ownedItemsUserId;
        Item.find({owned_by: ownedByUser}).populate('owned_by', 'name.first name.last username _id').exec(function(err, items) {
                if (err) {
                    res.render('error', {
                        status: 500
                    });
                } else {
                    console.log("Sending owned user items")
                    res.jsonp(items);
            }
        })
    }
    // find all items
    else {
    Item.find().sort('-created').populate('owned_by', 'name.first name.last username _id').exec(function(err, items) {
        if (err) {
            res.render('error', {
                status: 500
            });
        } else {
            console.log("Sending all items w/o certain criteria")
            res.jsonp(items);
        }
    });
    };
};


// Email to buyer and seller
exports.email = function(req, res) {
    console.log("in the email function")
    console.log("this is the req-item", req.item)
    // Email to Buyer
    Item.findOne({_id: req.item._id}).populate("owned_by").populate("bought_by").exec(function(err, selectedItem){
        console.log("this is selectedItem in emailf", selectedItem);
        mailer.smtpTransport.sendMail({
            from: "PleaseTake.It <pleasetakeitapp@gmail.com>", // sender address.  Must be the same as authenticated user if using Gmail.
            to: selectedItem.bought_by.email, // BUYER EMAIL
            subject: "Item Purchased",
            generateTextFromHTML: true,
            html: "<p>Hi, " +
            selectedItem.bought_by.username + // BUYER USERNAME
            ". You have purchased " +
            selectedItem.title +
            ". Please contact " +
            selectedItem.owned_by.username+ // Seller name
            " at " +
            selectedItem.owned_by.email + // Seller EMAIL
            " for more details such as an agreed time and date of pickup. Also, please remind the owner to confirm pickup after you have recieved the item otherwise your deposit will be donated to charity."
            }, function(error, response){
                if(error){
                   console.log(error);
                }
                else {
                   console.log("Message sent: " + response.message);
                }
               mailer.smtpTransport.close(); // shut down the connection pool, no more messages.  Comment this line out to continue sending emails.
        });


    // Email to Seller
        mailer.smtpTransport.sendMail({
        from: "PleaseTake.It <pleasetakeitapp@gmail.com>", // sender address.  Must be the same as authenticated user if using Gmail.
        to: selectedItem.owned_by.email, // SELLER EMAIL
        subject: "Congrats, your item was purchased!",
        generateTextFromHTML: true,
        html: "<p>Hi, " +
        selectedItem.owned_by.username + // SELLER USERNAME
        ". <br><br>" +
        selectedItem.bought_by.username +
        " has placed a $10 deposit on your item. Please complete the deal below!</p>" +
        "<a href='http://localhost:3000/#!/deal_confirmation/" + selectedItem._id + "'>Finish Deal</a><br>"
        }, function(error, response){
            if(error){
               console.log(error);
            }
            else {
               console.log("Message sent: " + response.message);
            }
           mailer.smtpTransport.close(); // shut down the connection pool, no more messages.  Comment this line out to continue sending emails.
        });
    })
}



var paymentAction = function(paymentObject, done){
  console.log("inside paymentaction, object is", paymentObject)
  var paymentOptions = {
      "appears_on_statement_as": paymentObject.statement,
      "amount": parseInt(paymentObject.amount),
    // create orders later
    // https://docs.balancedpayments.com/1.1/api/orders/#create-an-order
  };
  balanced.get('/cards/'+paymentObject.balancedToken).debit(paymentOptions).then(function(debit){
    done(debit.toJSON());
    console.log("are we here and have the debit?_", debit)
  })
};

exports.makePayment = function(req, res){
    console.log("user")
    User.findOne({_id: req.user._id}, function(err, user){
        // user needs to have a balanced token
      Item.findOne({_id: req.body.item._id}, function(err, item){
        // req.body.balancedToken = user.balancedToken;
        paymentAction(req.body, function(debitObject){
          var payment = new Payment({
            amount: parseInt('10'),
            giver: req.user._id,
            taker: req.body.item.owned_by._id,
            item: req.body.item._id,
            balancedId: debitObject.id,
            status: debitObject.status,
            type: 'debit'
          });
          console.log("Finishing payment")
          item.status = 'reserved';
          item.bought_by = req.user._id;
          item.payment = payment;
          user.save(item.save(function(err){
                res.jsonp(item);
                console.log(user, item);
                console.log("payment done")
            })
        )
      })
    })
})
}

//Those mails need to be updated with payment
//Deal Success so money goes back to buyer
exports.dealSuccess = function(req, res) {

    Item.findOne({_id: req.item._id}).populate("bought_by").exec(function(err, selectedItem){

        mailer.smtpTransport.sendMail({
            from: "PleaseTake.It <pleasetakeitapp@gmail.com>",
            to: selectedItem.bought_by.email, // BUYER EMIAL
            subject: "Item pickup confirmed",
            generateTextFromHTML: true,
            html: "<p>Hi, " +
            selectedItem.bought_by.username + //BUYER USERNAME
            ".<br><br>" +
            "Your retrieval of the item has been confirmed so your deposit will be returned to you. We hope you enjoyed your experience with PleaseTakeIt and hope to see you soon."
        }, function(error, response){
            if(error){
               console.log(error);
            }
            else {
               console.log("Message sent: " + response.message);
            }
           mailer.smtpTransport.close(); // shut down the connection pool, no more messages.  Comment this line out to continue sending emails.
        });
    })
}

//Deal Failed so money goes to charity
exports.dealFail = function(req, res) {

    Item.findOne({_id: req.item._id}).populate("bought_by").exec(function(err, selectedItem){

        mailer.smtpTransport.sendMail({
            from: "PleaseTake.It <pleasetakeitapp@gmail.com>",
            to: selectedItem.bought_by.email, //  BUYER EMIAL
            subject: "Item not picked up",
            generateTextFromHTML: true,
            html: "<p>Hi, " +
            selectedItem.bought_by.username + //BUYER USERNAME
            ".<br><br>" +
            "Unfortunately, the owner of the item indicates that you have not picked up the item on the agreed date. As a result, your deposit will be donated to charity."
        }, function(error, response){
            if(error){
               console.log(error);
            }
            else {
               console.log("Message sent: " + response.message);
            }
           mailer.smtpTransport.close(); // shut down the connection pool, no more messages.  Comment this line out to continue sending emails.
        });
    })
}
