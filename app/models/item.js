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
    active: {
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
    wanted_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});


/**
 * Validations
 */
// ItemSchema.path('title').validate(function(title) {
//     return title.length;
// }, 'Title cannot be blank');


mongoose.model('Item', ItemSchema);
