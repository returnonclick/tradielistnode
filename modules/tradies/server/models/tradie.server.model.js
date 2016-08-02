'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Tradie Schema
 */
var TradieSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Tradie name',
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Tradie', TradieSchema);
