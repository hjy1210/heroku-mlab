var Qti = require('../models/qti');
var async = require('async');
var xmlStr2jsonStr = require('./xmljsonutil').xmlStr2jsonStr
var DOMParser = require('xmldom').DOMParser;
var XMLSerializer = require('xmldom').XMLSerializer

var qtis

function changesrc(str, code) {
  var s = str.replace(/<img src='/gi, function imgFunction(x) { return "<img src='" + code + "/" })
  s = s.replace(/<audio src='/gi, function audioFunction(x) { return "<audio src='" + code + "/" })
  return s
}

function generateQtiInfo(qtis) {
  var info = []
  for (var i = 0; i < qtis.length; i++) {
    var oneinfo = {}
    oneinfo.code = qtis[i].code
    oneinfo.stdans = []
    for (var j = 0; j < qtis[i].stdans.length; j++) {
      oneinfo.stdans.push({
        len: qtis[i].stdans[j].ans.length,
        type: qtis[i].stdans[j].type, score: qtis[i].stdans[j].score
      })
    }
    info.push(oneinfo)
  }
  return JSON.stringify(info)
}

function getScore(type, count, score, std, user) {
  switch (type) {
    case 'S':
    case 'K':
    case 'F':
      return std === user ? score : 0
    case 'M':
      var label = std[0].match(/[A-Z]/) ? "ABCDEFGHIJKL" : "1234567890-#"
      label = label.substr(0, count)
      if (user === "") return 0
      var matchcount = 0;
      for (var i = 0; i < count; i++) {
        matchcount += (user.indexOf(label[i]) + 0.5) * (std.indexOf(label[i]) + 0.5) > 0 ? 1 : -1
      }
      if (matchcount < 0) matchcount = 0
      return score * matchcount / count
  }
}

exports.index = function (req, res) {
  Qti.find({})
    .exec(function (err, list_qtis) {
      if (err) { return next(err); }
      qtis = list_qtis
      //Successful, so render
      res.render('qtiindex', { qtis: qtis });
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
      res.render('qti_list', { qtis: qtis });
    });
};

exports.testform_get = function (req, res, next) {
  Qti.find({})
    .exec(function (err, list_qtis) {
      if (err) { return next(err); }
      //Successful, so render
      qtis = list_qtis
      for (var i = 0; i < qtis.length; i++) {
        qtis[i].qtiXML = qtis[i].qtiXML.replace(/</g, "&lt;")
        console.log(qtis[i].responses)
      }
      // ceectestinfo provide qti info for browser side script to collect user's answer
      res.render('qti_testform', { qtis: qtis });
    });
};

exports.testform_post = function (req, res, next) {
  //console.log(req.body)
  var data = req.body.qtiinfo
  var userqtis = JSON.parse(data)  // [{code,stdans:[{len,type,score,userans}]}]
  Qti.find({})
    .exec(function (err, list_qtis) {
      if (err) { return next(err); }
      //Successful, so render
      qtis = list_qtis
      for (var i = 0; i < list_qtis.length; i++) {
        arrangeData(qtis[i], "qti/")
      }
      var codes = qtis.map(x => x.code)
      for (var i = 0; i < userqtis.length; i++) {
        var code = userqtis[i].code
        var qtiindex = codes.indexOf(code)
        for (var j = 0; j < userqtis[i].stdans.length; j++) {
          var type = userqtis[i].stdans[j].type
          var count = qtis[qtiindex].items && qtis[qtiindex].items[j] && qtis[qtiindex].items[j].choices ? qtis[qtiindex].items[j].choices.length : 0
          var score = userqtis[i].stdans[j].score
          var std = qtis[qtiindex].stdans[j].ans
          var user = userqtis[i].stdans[j].userans
          var scoreGot = getScore(type, count, score, std, user)
          userqtis[i].stdans[j].scoreGot = scoreGot
          userqtis[i].stdans[j].ans = qtis[qtiindex].stdans[j].ans
        }
      }
      res.render('report', { userqtis: userqtis })
      //res.send(JSON.stringify(userqtis, null, 2))
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
    console.log(qti.responses)
    qti.qtiXML = qti.qtiXML.replace(/</g, "&lt;")
    res.render('qti_detail', { qti: qti })
  });
};

exports.qti_detail_image = function (req, res, next) {
  console.log(req.params.code, req.params.medianame)   ///// 06/27/2017 change from id to code
  async.parallel({
    qti: function (callback) {
      Qti.findOne({ 'code': req.params.code }) /////Qti.findById(req.params.id) change om 06/27/2017
        .exec(callback);
    }
  }, function (err, results) {
    if (err) { return next(err); }
    if (!results.qti) {
      return next(new Error(`code:${req.params.code} not exists!`))
    }
    var imgindex
    console.log("results:", results)
    for (var i = 0; i < results.qti.media.length; i++) {
      console.log(results.qti.media[i].filename)
      if (results.qti.media[i].filename === req.params.medianame) {
        imgindex = i
        break
      }
    }
    console.log(imgindex)
    if (imgindex >= 0) {
      res.contentType(results.qti.media[imgindex].mimetype);
      res.send(results.qti.media[imgindex].content);
    } else {
      var err = new Error('media not Found');
      err.status = 404;
      next(err);
    }

    //Successful, so render
  });

}

// Display book create form on GET
exports.qti_create_get = function (req, res, next) {
  console.log(req.body)
  res.render('qti_create', { qtis: qtis })
};

function extractQtiInfo(req, curqti) {
  var myqti = {}
  var parser = new DOMParser()
  var xmldoc = parser.parseFromString(curqti, "text/xml").documentElement
  myqti.identifier = xmldoc.getAttribute("identifier")
  myqti.qtiXML = curqti
  var responses = xmldoc.getElementsByTagName('responseDeclaration')
  myqti.responses = []
  for (var i = 0; i < responses.length; i++) {
    var ele = {
      identifier: responses[i].getAttribute('identifier'),
      cardinality: responses[i].getAttribute('cardinality'),
      baseType: responses[i].getAttribute('baseType')
    }
    var correctNode = responses[i].getElementsByTagName("correctResponse")[0]
    if (correctNode) {
      var correctValues = correctNode.getElementsByTagName('value')
      ele.answer = []
      for (var j = 0; j < correctValues.length; j++) {
        ele.answer.push(correctValues[j].childNodes[0].nodeValue)
      }
    }
    myqti.responses.push(ele)
  }
  var itemBody=xmldoc.getElementsByTagName('itemBody')[0]
  var choiceInteractions=itemBody.getElementsByTagName("choiceInteraction")
  //////////
  myqti.itemBody = new XMLSerializer().serializeToString(xmldoc.getElementsByTagName('itemBody')[0])

  var media = []
  console.log("files.count", req.files.length)
  for (var i = 0; i < req.files.length; i++) {
    var file = req.files[i]
    if (file.originalname.substr(file.originalname.lastIndexOf(".") + 1).toLowerCase() !== "xml") {
      console.log("files:", file.originalname, file.mimetype, file.size, file.buffer.length)
      media.push({ filename: file.originalname, mimetype: file.mimetype, content: file.buffer })
    }
  }
  if (media.length > 0) {
    myqti.media = media
  }
  return myqti
}
// Handle book create on POST
exports.qti_create_post = function (req, res, next) {
  /////console.log("data=", data)
  function process(curqti) {
    var myqti = extractQtiInfo(req, curqti)
    // ["....."] -> "...." except choices

    ///// 存入資料庫之前可以再做資料整理?
    ///// 將 @....@, \(\ceec{..}\)展開放到資料庫裡面，反而不利於以後的搜尋與資料處理
    ///// 將媒體的src更改放到資料庫更是多此一舉，src必須隨網頁的位置而更動才對
    /////modifyData(myqti)
    /////
    var qti = new Qti(myqti);

    /////console.log('qti: ' + qti);
    /////console.log("files",req.files)

    var errors = req.validationErrors();
    if (errors) {
      console.log("errors:", errors)
      res.render('qticreate')
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
              res.redirect(qti.url);
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
    res.redirect('/qtibank/qtis')
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
