'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;


/**
 * OfferItem Schema
 */
var ItemSchema = new Schema({
    status: {
        type: String,
        default: "active"
    },
    picture: {
        type: String,
        // required: true
    },
    title: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    category: String,
    address: {
        type: String,
        required: true
    },
    lnglat: {
        type: [Number],
        index: '2d'
    },
    startTime: {
        type: Date,
        default: Date.now
    },
    endTime: {
        type:Date,
    },
    duration: {
        type: Number,
    },
    condition: {
        type: Number,
        default: 5
    },
    owned_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    wanted_by: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    bought_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    bought_date: {
        type: Date
    }
});


/**
 * Statics
 */

// w/o populate
ItemSchema.statics.load = function(id, cb) {
    this.findOne({
        _id: id
    }).populate('owned_by', 'username').populate('bought_by', 'username').exec(cb);
};

// ItemSchema.statics.loadpopulated = function(id, cb) {
//     this.findOne({
//         _id: id
//     }).populate('owned_by').populate('bought_by').exec(cb);
// };
// ItemSchema.statics.load = function(id, cb) {
//     this.findOne({
//         _id: id
//     }).populate('owned_by').exec(cb);
// };


mongoose.model('Item', ItemSchema);
