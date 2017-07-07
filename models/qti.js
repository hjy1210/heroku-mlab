var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var QtiSchema = Schema({
  identifier: { type: String, required: true },
  //stdans:{type:String, required:true},  ///// 06/27/2017 add stdans
  responses: [{
    identifier: { type: String, required: true },
    cardinality: { type: String, required: true },
    baseType: { type: String, required: true },
    answer:[{type:String}]
  }],
  itemBody:{type:String,required:true},
  qtiXML: { type: String, required: true },
  media: [{
    filename: { type: String, required: true },
    mimetype: { type: String },
    content: { type: Buffer, required: true }
  }]
});


QtiSchema
  .virtual('url')
  .get(function () {
    return '/qtibank/qti/' + this.identifier;  
  });
QtiSchema
  .virtual('mediacount')
  .get(function () {
    if (this.media) {
      return this.media.length
    } else {
      return 0
    }
  });

//Export model
module.exports = mongoose.model('Qti', QtiSchema);