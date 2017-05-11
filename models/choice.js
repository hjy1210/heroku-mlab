var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var ChoiceSchema = Schema(
  {
    prompt:{type: String, required: true},
    pictures:[{type:String}],
    simpleChoices:[{type:String}],
    correctResponse:{type:Number,min:1,max:5},
  }
)

ChoiceSchema
  .virtual('url')
  .get(()=>{
    return 'item/'+this._id
  })

module.exports=mongoose.model('Choice',ChoiceSchema)