var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var CmlSchema = Schema({
  identifier: { type: String, required: true },
  
  itemInfo: { type: String, required: true }
});

//Export model
module.exports = mongoose.model('Cml', CmlSchema);