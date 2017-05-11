//Set up mongoose connection
var mongoose = require('mongoose');
mongoose.Promise = global.Promise

const Choice = require('./choice')

var mongoDB = 'mongodb://localhost:27017/conFusion';
mongoose.connect(mongoDB);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.on('open', () => {
  console.log("Connect correctly to server")

  const newChoice = Choice(
    {
      prompt: "What is the correct answer?",
      pictures: [],
      simpleChoices: ["3<6", "2.718<1.2154", "-3.14<-4"],
      correctResponse: 1,
    }
  )
  console.log(newChoice);
  newChoice.save((err) => {
    if (err) throw err
    console.log('Choice created');
    Choice.find({}, (err, choices) => {
      if (err) throw err
      console.log(choices);
      db.collection('choices').drop(() => { // always small case 
        db.close()
      })
    })
  })
})
