var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var PsetSchema = Schema({
  code:{type:String,required:true},
  head: {type: String},
  tail:{type:String},
  items: [{
    head: {type: String},
    tail:{type:String},
    choices: [{type: String,required: true}],
    spaces:{ type: Number, min: 0, max: 10 }
  }],
  media:[{
    filename:{type:String, required:true},
    mimetype:{type:String},
    content:{type:Buffer, required:true}
  }],
  espaces:{type:String}
});

// Virtual for book's URL
PsetSchema
.virtual('url')
.get(function () {
  return '/psetbank/pset/' + this._id;
});
PsetSchema
.virtual('mediacount')
.get(function () {
  if (this.media){
    return this.media.length
  } else {
    return 0
  }
});

//Export model
module.exports = mongoose.model('Pset', PsetSchema);