/*
* GET users listing.
*/
var stripe = require('stripe')("pk_test_RqiSLBD86I6Ur0YkYVt24fmL"),
  mongoose = require('mongoose'),
  User = mongoose.model('User');
// var models = require('../models/connect');

exports.list = function(req, res){
  res.send("respond with a resource");
};

exports.deposit = function(req, res){
  //not registered user
  if(!req.user){
    stripe.charges.create({
      // amount: req.body.amount,
      // currency: req.body.currency,
      // card: req.body.stripeToken,
      // description: req.body.description || null
      amount: 1000,
      currency: "usd",
      card: req.body.stripeToken,
      description: req.body.description || null
    }, function(err, charge){
      res.render('success_deposit', {charge: charge});
    });
  }
  //registered user
  else {
    var stripeToken = req.body.stripeToken;
    User.findOne({_id: req.user._id}, function(err, user){
      console.log("do we have a token:", stripeToken);
      console.log("the amount charged is:",req.body.amount);
      console.log("the type of amount is:",typeof req.body.amount);
      console.log(parseInt(req.body.amount));
      if(err) return err;
      //user with stripe_id
      if(user.stripe_id){
        console.log("the user already has a stripe id")
        stripe.charges.create({
          amount: parseInt(req.body.amount),
          currency: req.body.currency,
          customer: user.stripe_id
        }, function(err, charge){
          console.log("the user has been charged this amount", charge)
          res.render('success_deposit', {charge: charge});
        });
      }
      //user w/o stripe_id
      else{
        console.log("we are creating a new stripe user");
        stripe.customers.create({
          card: stripeToken,
          email: req.user.email
        }).then(function(customer){
          user.stripe_id = customer.id;
          console.log("the new stripe user has the following object", customer)
          return stripe.charges.create({
            amount: 1000,
            currency: req.body.currency,
            customer: customer.id
          }, function(err, charge){
            user.save(function(err){
              console.log(typeof charge)
              res.render('success_deposit', {charge: charge});
            });
          });
        });
      }
    });
  }
};

exports.deposit_page = function(req, res){
  res.render('index', {user: req.user ? JSON.stringify(req.user) : 'null'});
};
