var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.redirect('/catalog');
});
router.get('/pugitem', function(req, res, next) {
  res.render('pugitem');
  //res.redirect('/catalog');
});

module.exports = router;
