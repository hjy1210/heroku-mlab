var Pset = require('../models/pset');
var async = require('async');
var xmlStr2jsonStr = require('./xmljsonutil').xmlStr2jsonStr

var psets

function changesrc(str, code) {
  var s = str.replace(/<img src='/gi, function imgFunction(x) { return "<img src='" + code + "/" })
  s = s.replace(/<audio src='/gi, function audioFunction(x) { return "<audio src='" + code + "/" })
  return s
}

exports.index = function (req, res) {
  Pset.find({})
    .exec(function (err, list_psets) {
      if (err) { return next(err); }
      psets = list_psets
      //Successful, so render
      res.render('index', { psets: psets });
    });

};
// Display list of all books
exports.pset_list = function (req, res, next) {
  Pset.find({})
    .exec(function (err, list_psets) {
      if (err) { return next(err); }
      //Successful, so render
      psets = list_psets
      for (var i = 0; i < list_psets.length; i++) {
        arrangeData(psets[i], "pset/")
      }
      res.render('pset_list', { psets: psets });
    });
};

exports.testform_get = function (req, res, next) {
  Pset.find({})
    .exec(function (err, list_psets) {
      if (err) { return next(err); }
      //Successful, so render
      psets = list_psets
      for (var i = 0; i < list_psets.length; i++) {
        arrangeData(psets[i], "pset/")
      }
      res.render('testform', { psets: psets });
    });
};

exports.testform_post = function (req, res, next) {
   res.send('NOT IMPLEMENTED: Book update GET');
}


function arrangeData(pset, dir = "") {
  // change id to code
  console.log("code=", pset.code)
  var code = "" + pset.code     //"" + pset._id
  if (dir) {
    code = dir + code
  }
  var lastnumber = 1
  if (pset.head) {
    pset.head = changesrc(pset.head, code)
    //將@ABCDEFGHIJKL@轉成從" ABCDEFGHIJKL"中選一的select element
    pset.head = pset.head.replace(/@.+?@/g, (x) => {
      var s = `<select id='${pset.code}.${lastnumber}' title='${pset.code}.${lastnumber}' style='width:60px'><option value=' '> </option>`
      for (var i = 1; i < x.length - 1; i++) {
        s += `<option value='${x[i]}'>${x[i]}</option>`
      }
      s += '</select>'
      lastnumber++
      return s;
    })
  }
  if (pset.tail)
    pset.tail = changesrc(pset.tail, code)
  if (pset.items && pset.items.length > 0) {
    for (var i = 0; i < pset.items.length; i++) {
      if (pset.items[i].head) {
        pset.items[i].head = changesrc(pset.items[i].head, code)
        var matches = pset.items[i].head.match(/\\ceec\{\d+\}/g)
        var count = 0
        if (matches) {
          count = matches.length
        }
        if (count > 0) {
          var mathsymbol = "1234567890-±"
          for (var ii = 0; ii < count; ii++) {
            var s = `<select id='${pset.code}.${lastnumber}.${ii+1}' title='${pset.code}.${lastnumber}.${ii+1}' style='width:60px'><option value=' '> </option>`
            for (var j = 0; j < mathsymbol.length; j++) {
              s += `<option value='${mathsymbol[j]}'>${mathsymbol[j]}</option>`
            }
            s += '</select>'
            pset.items[i].head += `\\(\\ceec{${ii+1}}\\)=` + s + `\\(\\hspace{0.5cm}\\)`
          }
          lastnumber++
        }
      }
      if (pset.items[i].tail)
        pset.items[i].tail = changesrc(pset.items[i].tail, code)
      if (pset.items[i].choices && pset.items[i].choices.length > 0) {
        for (var j = 0; j < pset.items[i].choices.length; j++) {
          pset.items[i].choices[j] = changesrc(pset.items[i].choices[j], code)
        }
      }
      /*if (pset.items[i].spaces && pset.items[i].spaces > 0) {
        pset.items[i].labels = " 1234567890–±"
        pset.items[i].leadings = []
        for (var j = 0; j < pset.items[i].spaces; j++) {
          //leadings.push("\\(\\fbox{" + (i + 1) + "}\\)=")
          pset.items[i].leadings.push("\\(\\ceec{" + (j + 1) + "}\\)=")
        }
      }*/
    }
  }
  /*var espacecount
  var labels
  var errmsg
  var leadings
  var labels
  if (pset.espaces) {
    var tokens = pset.espaces.split(" ")
    if (tokens.length != 2) {
      errmsg = "token length error"
    } else {
      espacecount = parseInt(tokens[0])
      if (isNaN(espacecount) || espacecount < 1 || espacecount > tokens[1].length) {
        errmsg = "format example: 10 ABCDEFGHIJKL"
      }
    }
    if (errmsg) {
      //var err1 = new Error(errmsg);
      //err1.status = 500;
      //return next(err1);
      return errmsg
    }
    leadings = []
    for (var i = 0; i < espacecount; i++) {
      //leadings.push("\\(\\fbox{" + (i + 1) + "}\\)=")
      leadings.push("\\(\\ceec{" + (i + 1) + "}\\)=")
    }
    pset.leadings = leadings
    labels = " " + tokens[1]
    pset.labels = labels
    pset.espacecount = espacecount
    return null
  }*/
}
// Display detail page for a specific book
exports.pset_detail = function (req, res, next) {
  //var id = req.params.id
  async.parallel({
    pset: function (callback) {
      Pset.findOne({ 'code': req.params.code })     //Pset.findById(req.params.id)
        .exec(callback);
    }
  }, function (err, results) {
    if (err) { return next(err); }
    if (!results.pset) {
      return next(new Error(`code: ${req.params.code} not exists`))
    }
    var errmsg = arrangeData(results.pset)
    if (errmsg) {
      var err1 = new Error(errmsg);
      err1.status = 500;
      return next(err1);
    }

    res.render('psetdetail', { pset: results.pset, psets: psets })
  });
};

exports.pset_detail_image = function (req, res, next) {
  console.log(req.params.code, req.params.medianame)   ///// 06/27/2017 change from id to code
  async.parallel({
    pset: function (callback) {
      Pset.findOne({ 'code': req.params.code }) /////Pset.findById(req.params.id) change om 06/27/2017
        .exec(callback);
    }
  }, function (err, results) {
    if (err) { return next(err); }
    if (!results.pset){
      return next(new Error(`code:${req.params.code} not exists!`))
    }
    var imgindex
    console.log("results:", results)
    for (var i = 0; i < results.pset.media.length; i++) {
      console.log(results.pset.media[i].filename)
      if (results.pset.media[i].filename === req.params.medianame) {
        imgindex = i
        break
      }
    }
    console.log(imgindex)
    if (imgindex >= 0) {
      res.contentType(results.pset.media[imgindex].mimetype);
      res.send(results.pset.media[imgindex].content);
    } else {
      var err = new Error('media not Found');
      err.status = 404;
      next(err);
    }

    //Successful, so render
  });

}

// Display book create form on GET
exports.pset_create_get = function (req, res, next) {
  //Get all authors and genres, which we can use for adding to our book.
  /*async.parallel({
      authors: function(callback) {
          Author.find(callback);
      },
      genres: function(callback) {
          Genre.find(callback);
      },
  }, function(err, results) {
      if (err) { return next(err); }
      res.render('book_form', { title: 'Create Book', authors: results.authors, genres: results.genres });
  });*/
  //res.send("pset_create_get Not implement yet")
  console.log(req.body)
  res.render('psetcreate', { psets: psets })
};

// Handle book create on POST
exports.pset_create_post = function (req, res, next) {
  /////console.log("data=", data)
  function process(curpset) {
    var mypset = JSON.parse(curpset)
    // ["....."] -> "...." except choices
    // check espaces compatibility
    var msg = cleanPset(mypset)
    if (msg) {
      return msg
    }
    //mypset.espaces=parseInt(mypset.espaces) ///// consider transform from xml, convert string to number
    //if (mypset.items && mypset.items.length > 0) {
    //  for (var i = 0; i < mypset.items.length; i++) {
    //    if (mypset.items[i].spaces) {
    //      mypset.items[i].spaces = parseInt(mypset.items[i].spaces)
    //    }
    //  }
    //}
    var media = []
    console.log("files.count", req.files.length)
    for (var i = 0; i < req.files.length; i++) {
      var file = req.files[i]
      console.log("files:", file.originalname, file.mimetype, file.size, file.buffer.length)
      media.push({ filename: file.originalname, mimetype: file.mimetype, content: file.buffer })
    }
    if (media.length > 0) {
      mypset.media = media
    }
    var pset = new Pset({
      code: mypset.code,
      stdans: mypset.stdans,
      items: mypset.items,
      head: mypset.head,
      tail: mypset.tail,
      media: mypset.media//,
      //espaces: mypset.espaces
    });

    /////console.log('pset: ' + pset);
    /////console.log("files",req.files)

    var errors = req.validationErrors();
    if (errors) {
      console.log("errors:", errors)
      res.render('psetcreate')
    }
    else {
      // Data from form is valid.
      // We could check if book exists already, but lets just save.
      Pset.findOne({ 'code': mypset.code })
        .exec(function (err, found_code) {
          if (err) { return next(err); }

          if (found_code) {
            //code exists, redirect to its detail page
            /////console.log('found_code: ' + found_code);
            /////res.redirect(found_code.url);
            return next(new Error(`題組 ${mypset.code} 已經存在`))
          }
          else {
            pset.save(function (err) {
              if (err) { return next(err); }
              //successful - redirect to new book record.
              /////console.log("pset.url",pset.url)
              //res.redirect(pset.url);
              res.redirect('/psetbank/psets')
            });
          }
        })
    }
  }

  // 將首尾的空白字元清除，字串陣列長度為1改成字串
  function striparrayoflengthone(data) {
    if (typeof (data) === 'object' && data.length === 1) {
      return data[0].trim()
    } else {
      return data.trim()
    }
  }

  // 將首尾的空白字元清除，字串陣列長度為1改成字串，字串長度為0,根據需要加以清除
  function cleanPset(pset) {
    if (pset.code) {
      pset.code = striparrayoflengthone(pset.code)
    }
    //if (pset.stdans) {
    //  pset.stdans = striparrayoflengthone(pset.stdans)
    //}
    if (pset.head) {
      pset.head = striparrayoflengthone(pset.head)
      if (pset.head === '') {
        delete pset.head
      }
    }
    if (pset.items) {
      for (var i = 0; i < pset.items.length; i++) {
        if (pset.items[i].head) {
          pset.items[i].head = striparrayoflengthone(pset.items[i].head)
          if (pset.items[i].head === '') {
            delete pset.items[i].head
          }
        }
        if (pset.items[i].choices) {
          for (var j = 0; j < pset.items[i].choices.length; j++) {
            if (pset.items[i].choices[j].trim() === "") {
              return next(new Error(`${i + 1}item,${j + 1} choice is empty`))
            }
          }
        }
        /*if (pset.items[i].spaces) {
          pset.items[i].spaces = striparrayoflengthone(pset.items[i].spaces)
          if (pset.items[i].spaces == '') {
            delete pset.items[i].spaces
          } else {
            ///// consider transform from xml, convert string to number
            pset.items[i].spaces = parseInt(pset.items[i].spaces)
            if (!Number.isInteger(pset.items[i].spaces) || pset.items[i].spaces < 1) {
              return `spaces of ${i + 1}-th item is not an positive integer`
            }
          }
        }*/
        if (pset.items[i].tail) {
          pset.items[i].tail = striparrayoflengthone(pset.items[i].tail)
          if (pset.items[i].tail === '') {
            delete pset.items[i].tail
          }
        }
      }
    }
    if (pset.tail) {
      pset.tail = striparrayoflengthone(pset.tail)
      if (pset.tail === '') {
        delete pset.tail
      }
    }
    var errmsg, espacecount
    /*if (pset.espaces) {
      pset.espaces = striparrayoflengthone(pset.espaces)
      if (pset.espaces === '') {
        delete pset.espaces
      } else {
        var tokens = pset.espaces.split(" ")
        if (tokens.length != 2) {
          errmsg = "espaces token length error"
        } else {
          espacecount = parseInt(tokens[0])
          if (isNaN(espacecount) || espacecount < 1 || espacecount > tokens[1].length) {
            errmsg = "espaces format example: 10 ABCDEFGHIJKL, length of 'ABCDEFGHIJKL'>=10"
          }
        }
      }
    }*/
    return errmsg
  }

  var data = req.body
  if (!data.pset) return next(new Error("empty pset"))
  var str = data.pset.trim()
  if (str.length === 0) return next(new Error("empty pset"))
  var msg
  if (str[0] === '<') {
    xmlStr2jsonStr(str, (err, json) => {
      if (err) return next(err)
      msg = process(json)
    })
  } else {
    msg = process(str)
  }
  if (msg) return (next(new Error(msg)))
};


// Display book delete form on GET
exports.pset_delete_get = function (req, res, next) {
  Pset.findOne({'code':req.params.code})
    .exec(function (err, pset) {
      if (err) { return next(err); }
      if (!pset){
        return next(new Error(`code: ${req.params.code} not exists!`))
      }
      //Successful, so render
      res.render('pset_delete', { pset:pset});
    })
};

// Handle book delete on POST
exports.pset_delete_post = function (req, res, next) {
      //Assume valid bookinstance id in field (should check)
    Pset.findOne({'code':req.body.code}).remove().exec(function deletePset(err) {
        if (err) { return next(err); }
        //success, so redirect to list of bookinstances.
        res.redirect('/psetbank/psets')
        });
};

// Display book update form on GET
exports.pset_update_get = function (req, res, next) {
  res.send('NOT IMPLEMENTED: Book update GET');
};

// Handle book update on POST
exports.pset_update_post = function (req, res, next) {
  res.send('NOT IMPLEMENTED: Book update POST');
};
