var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var PaymentSchema = new Schema({
  giver: {type: Schema.ObjectId,
          ref: "User"},
  taker: {type: Schema.ObjectId,
          ref: "User"},
  item: {type: Schema.ObjectId,
            ref: "Item"},
  amount: Number,
  balancedId: String,
  created: {type: Date,
            default: Date.now},
  status: String,
  type: String,
});

mongoose.model('Payment', PaymentSchema);
