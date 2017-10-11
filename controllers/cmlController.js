var Qti = require('../models/cml');
var jsons2html = require('./jsons2html')
var async = require('async');
var xmlStr2jsonStr = require('./xmljsonutil').xmlStr2jsonStr
var DOMParser = require('xmldom').DOMParser;
var XMLSerializer = require('xmldom').XMLSerializer
var getScore = require('./getscore')

var qtis
exports.index = function (req, res) {
  Qti.find({})
    .exec(function (err, list_qtis) {
      if (err) { return next(err); }
      qtis = list_qtis
      //Successful, so render
      res.render('cmlindex', { cmls: qtis });
    });

};
// Display list of all books
exports.qti_list = function (req, res, next) {
  Qti.find({})
    .exec(function (err, list_qtis) {
      if (err) { return next(err); }
      //Successful, so render
      qtis = list_qtis
      //for (var i = 0; i < list_qtis.length; i++) {
      //  arrangeData(qtis[i], "qti/")
      //}
      res.render('cml_list', { qtis: qtis });
    });
};

exports.testform_get = function (req, res, next) {
  //res.send('NOT IMPLEMENTED: Book update POST');
  //var id = req.params.id
  Qti.find({}, 'identifier')
    .exec(function (err, list_qtis) {
      if (err) { return next(err); }
      //Successful, so render
      //console.log(list_qtis)
      var n = list_qtis.length
      var testLength = 5
      var results = []
      for (var i = 0; i < testLength; i++) {
        n = list_qtis.length
        if (n > 0) {
          var select = Math.floor(Math.random() * n)
          results.push(list_qtis[select].identifier)
          list_qtis.splice(select, 1)
        } else {
          break;
        }
      }

      Qti.find({identifier:{$in:results}})
        .exec(function (err, list_qtis) {
          if (err) { 
            return next(err); 
          }
          qtis=list_qtis
          var jsons = []
          for (var i=0;i<qtis.length;i++){
            jsons.push(JSON.parse(qtis[i].itemInfo))
          }
          var tuple = jsons2html(jsons)
          res.render('cml_test_detail', {html: tuple.divContent, styleContent: tuple.styleContent, testInfoStr: tuple.testInfoStr })
          //res.send(jsons);
      })
    });
};

exports.testform_post = function (req, res, next) {
  //res.send('NOT IMPLEMENTED: Book update POST');
  var r = JSON.parse(req.body.answersheet)
  console.log("r",r)
  var ids=[]
  for (var x in r){
    ids.push(x)
  }
  console.log("ids",ids)
  Qti.find({identifier:{$in:ids}})
    .exec(function (err, list){
      if (err) { return next(err); }
      var testInfo = {}
      var corrects = {}
      var outcomes = {}
      var processings = {}
      var scoreInfo = {}
      //console.log("list[0]",list[0])
      for (var i=0;i<list.length;i++) {
        //res1+=JSON.stringify(JSON.parse(results[x].itemInfo).responseInfo,null,2)
        var x=list[i].identifier
        testInfo[x] = JSON.parse(list[i].itemInfo)
        console.log("testInfo[x]",x,testInfo[x])
        corrects[x] = testInfo[x].responseInfo
        for (var y in corrects[x]) {
          if (corrects[x][y].mapping) {
            corrects[x][y].mapping = corrects[x][y].mapping.replace(/>\s*?</g, "><")
            corrects[x][y].mapping = new DOMParser().parseFromString(corrects[x][y].mapping).documentElement
          }
        }
        outcomes[x] = testInfo[x].outcomeInfo
        processings[x] = testInfo[x].responseProcessing.replace(/>\s*?</g, "><")
        processings[x] = new DOMParser().parseFromString(processings[x]).documentElement
        scoreInfo[x] = {
          responses: r[x], corrects: corrects[x],
          outcomes: outcomes[x], responseProcessing: processings[x]
        }
      }
      console.log(scoreInfo)
      var scoreResults = getScore(scoreInfo)
      res.send(JSON.stringify(scoreResults, null, 2))

  })
}


// Display detail page for a specific book
exports.qti_detail = function (req, res, next) {
  //var id = req.params.id
  async.parallel({
    qti: function (callback) {
      Qti.findOne({ 'identifier': req.params.identifier })     //qti.findById(req.params.id)
        .exec(callback);
    }
  }, function (err, results) {
    if (err) { return next(err); }
    if (!results.qti) {
      return next(new Error(`identifier: ${req.params.identifier} not exists`))
    }
    var qti = results.qti
    var jsons = [JSON.parse(qti.itemInfo)]
    //console.log(jsons)
    var tuple = jsons2html(jsons)
    /*var itemInfo=JSON.parse(qti.itemInfo)
    var testInfo={[qti.identifier]:itemInfo}
    qti={identifier:qti.identifier,html:itemInfo.html,
      responseInfo:JSON.stringify(itemInfo.responseInfo,null,2)}
    console.log(qti)
    res.render('cml_detail1', { qti: qti })*/
    //console.log(tuple)
    res.render('cml_detail', { qti: qti, html: tuple.divContent, styleContent: tuple.styleContent, testInfoStr: tuple.testInfoStr })
  });
};

exports.qti_detail_post = function (req, res, next) {
  var r = JSON.parse(req.body.answersheet)
  var correct = {}
  for (var id in r) {
    let idd = id
    correct[idd] = (cb) => {
      Qti.findOne({ 'identifier': idd })
        .exec(function (err, found_identifier) {
          if (err) { return next(err); }
          if (found_identifier) {
            //console.log(found_identifier)
            cb(null, found_identifier)
          }
          else {
            return next(new Error("Not found identifier"))
          }
        })
    }
  }
  //console.log(correct)
  async.parallel(correct, function (err, results) {
    if (err) { return next(err); }
    //console.log(r)
    //console.log(results)
    var res1 = ""
    for (var x in r) {
      //res1+=JSON.stringify(r[x],null,2)
    }
    res1 += "\n"
    var testInfo = {}
    var corrects = {}
    var outcomes = {}
    var processings = {}
    var scoreInfo = {}
    for (var x in results) {
      //res1+=JSON.stringify(JSON.parse(results[x].itemInfo).responseInfo,null,2)
      testInfo[x] = JSON.parse(results[x].itemInfo)
      corrects[x] = testInfo[x].responseInfo
      for (var y in corrects[x]) {
        if (corrects[x][y].mapping) {
          corrects[x][y].mapping = corrects[x][y].mapping.replace(/>\s*?</g, "><")
          corrects[x][y].mapping = new DOMParser().parseFromString(corrects[x][y].mapping).documentElement
        }
      }
      outcomes[x] = testInfo[x].outcomeInfo
      processings[x] = testInfo[x].responseProcessing.replace(/>\s*?</g, "><")
      processings[x] = new DOMParser().parseFromString(processings[x]).documentElement
      scoreInfo[x] = {
        responses: r[x], corrects: testInfo[x].responseInfo,
        outcomes: testInfo[x].outcomeInfo, responseProcessing: processings[x]
      }
    }

    var scoreResults = getScore(scoreInfo)
    res.send(JSON.stringify(scoreResults, null, 2))
  })
}

// Display book create form on GET
exports.qti_create_get = function (req, res, next) {
  console.log(req.body)
  res.render('cml_create', { qtis: qtis })
};

// Handle book create on POST
exports.qti_create_post = function (req, res, next) {
  /////console.log("data=", data)
  function process(curqti) {
    var json = JSON.parse(curqti)
    var identifier = json.identifier
    var myqti = { identifier: identifier, itemInfo: curqti }

    var qti = new Qti(myqti);

    console.log('qti: ' + qti);

    var errors = req.validationErrors();
    if (errors) {
      console.log("errors:", errors)
      res.render('cml_create')
    }
    else {
      // Data from form is valid.
      // We could check if book exists already, but lets just save.
      Qti.findOne({ 'identifier': myqti.identifier })
        .exec(function (err, found_identifier) {
          if (err) { return next(err); }

          if (found_identifier) {
            //identifier exists, redirect to its detail page
            /////console.log('found_code: ' + found_code);
            /////res.redirect(found_code.url);
            return next(new Error(`Qti item ${myqti.identifier} 已經存在`))
          }
          else {
            qti.save(function (err) {
              if (err) { return next(err); }
              //successful - redirect to new qti record.
              res.redirect('/cmlbank/qti/' + myqti.identifier);
            });
          }
        })
    }
  }

  var data = req.body
  if (!data.qti) return next(new Error("empty qti"))
  var str = data.qti.trim()
  if (str.length === 0) return next(new Error("empty qti"))
  var msg
  msg = process(str)
  if (msg) return (next(new Error(msg)))
};


// Display book delete form on GET
exports.qti_delete_get = function (req, res, next) {
  Qti.findOne({ 'identifier': req.params.identifier })
    .exec(function (err, qti) {
      if (err) { return next(err); }
      if (!qti) {
        return next(new Error(`identifier: ${req.params.identifier} not exists!`))
      }
      //Successful, so render
      res.render('qti_delete', { qti: qti });
    })
};

// Handle book delete on POST
exports.qti_delete_post = function (req, res, next) {
  //Assume valid bookinstance id in field (should check)
  Qti.findOne({ 'identifier': req.body.identifier }).remove().exec(function deleteQti(err) {
    if (err) { return next(err); }
    //success, so redirect to list of bookinstances.
    res.redirect('/cmlbank/qtis')
  });
};

// Display book update form on GET
exports.qti_update_get = function (req, res, next) {
  res.send('NOT IMPLEMENTED: Book update GET');
};

// Handle book update on POST
exports.qti_update_post = function (req, res, next) {
  res.send('NOT IMPLEMENTED: Book update POST');
};
