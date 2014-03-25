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
    active: Boolean,
    pic_url: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    category: Number,
    streetNumber: String,
    street: String,
    city: String,
    state: String,
    latlng: {latitude: Number, longitude: Number},
    time: {
        startTime: {
            type: Date,
            default: Date.now
        },
        duration: {
            type: Date,
            required: true
        // endTime: {}
        },
    },
    owned_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TakeItUser'
    },
    wanted_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TakeItUser'
    }
});

//write a method to get endTime = startTime + duaration selected


/**
 * Validations
 */
// ItemSchema.path('title').validate(function(title) {
//     return title.length;
// }, 'Title cannot be blank');


mongoose.model('Item', ItemSchema);
