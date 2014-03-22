require("./app/models/giveititem")
require("./app/models/giveituser")

// // Initializing system variables
// var config = require('./config/env'),
//     mongoose = require('mongoose');

// // Bootstrap db connection
// var db = mongoose.connect(config.db);

// Kelvin's way of initializing mongoose
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/pleasetakeit')
// Bootstrap db connection
var db = mongoose.connection;

var Item = mongoose.model('Item');
var User = mongoose.model('User');

// mongodb stores nothing that is null
var item = new Item ({
  active: true,
  pic_url: "www.url.com",
  title: "first item test",
  category: 1,
  location: "160 Pearl St.",
  time: {
    duration: "2014-03-19T17:13:35.702Z"
  }
})

// save item
item.save(function(err, item){
  if (err) {
    console.log("error saving item")
  }
  else {
    console.log(err, item)
  };
})


// create new user
var user = new User ({
  name: {
    first: "Kelvin",
    last: "Yu"
  },
  email: "test@test.com",
  username: "kdaddy",
  wantItems: [item._id],
  // itemsGive: {},
  location: {
    address: "162 Pearl St",
    city: "New York",
    state: "NY"
  },
  hashed_password: "hashed_password",
  provider: "provider",
  salt: "salt"
  // facebook
})
user.save(
  function(err) {
    console.log(err);
// // query for user
  User
    .find({
      username: "kdaddy",
    })
    .populate("wantItems")
    .exec(function(err, item) {
      console.log(err, item);
    });

  });

// //query for Item

// Item.find({
//   title: 'first item test'
//   }},function (err, item) {
//     console.log (err, item);
//     User.find({
//       name: 'Kelvin'
//     }, function (err, user) {
//       user.wantItems.push(item)
//       save
//     })
// });
