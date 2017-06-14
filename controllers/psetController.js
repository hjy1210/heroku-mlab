var Pset = require('../models/pset');

var async = require('async');
var psets

/*var data={
    psets:[{
      items:[{ 
        head: '下列哪一個選項是方程式 \\(7x^5-2x^4+14x^3-4x^2+7x-2=0\\) 的根？',
        choices: ["\\(-1\\)","\\(\\frac{1}{7}\\)","\\(-\\frac{1}{7}\\)","\\(\\frac{2}{7}\\)","-\\(\\frac{1}{7}\\)"],
      },{
        head: '考慮有理數 \\(\\frac{n}{m}\\)，其中 \\(m\\) 、 \\(n\\) 為正整數且 \\(1 \\le mn \\le 8\\) 。'+
          "則這樣的數值（例如 \\( \\frac{1}{2} \\) 與 \\( \\frac{2}{4}\\) 同值，只算一個）共有幾個？",
        choices: ["14 個","15 個","16 個","17 個","18 個"]
      }],
    },{
      head:"<p>Some people call it a traveling museum. Others refer to it as a living or open-air museum. Built "+
"in Brazil to celebrate the quincentennial of Columbus’ first voyage to the New World, the Nina, a "+
"Columbus-era replica ship, provides visitors with an accurate visual of the size and sailing implements "+
"of Columbus’ favorite ship from over 500 years ago.</p> "+
"<p>I joined the crew of the <em>Nina</em> in Gulf Shores, Alabama, in February 2013. As part of a research project "+
"sponsored by my university, my goal was to document my days aboard the ship in a blog. I quickly realized "+
"that I gained the most valuable insights when I observed or gave tours to school-age children. The field-trip "+
"tour of the Nina is hands-on learning at its best. In this setting, students could touch the line, pass around a "+
"ballast stone, and move the extremely large tiller that steered the ships in Columbus’ day. They soon came "+
"to understand the labor involved in sailing the ship back in his time. I was pleased to see the students "+
"become active participants in their learning process.</p> "+
"<p>The Nina is not the only traveling museum that provides such field trips. A visit to Jamestown "+
"Settlement, for example, allows visitors to board three re-creations of the ships that brought the first settlers "+
"from England to Virginia in the early 1600s. Historical interpreters, dressed in period garb, give tours to the "+
"Susan Constant, Godspeed, and Discovery. These interpreters often portray a character that would have "+
"lived and worked during that time period. Students touring these ships are encouraged to interact with the "+
"interpreters in order to better understand the daily life in the past. </p>"+
"<p>My experience on the Nina helps substantiate my long-held belief that students stay interested, ask "+
"better questions, and engage in higher-order thinking tasks when they are actively engaged in the learning "+
"process. The students who boarded the Nina came as passive learners. They left as bold explorers.</p>",
      items:[{ 
        head: 'What line of business is the author engaged in?',
        choices: [" Shipping.","Education."," Ecological tourism.","Museum administration."]
      },{
      head: 'Which of the following is true about the Nina introduced in the passage?',
        choices: ["She is a replica of a ship that Columbus built in Brazil",
        "She is always crowded with foreign tourists during holidays.",
        "She is the boat Columbus sailed in his voyage to the New World.",
        "She displays a replica of the navigational equipment used in Columbus’ time"]
      }]
    }]
  }*/
function changesrc(str, id) {
    var s = str.replace(/<img src='/gi, function imgFunction(x) { return "<img src='" + id + "/" })
    s = s.replace(/<audio src='/gi, function audioFunction(x) { return "<audio src='" + id + "/" })
    return s
}
exports.index = function (req, res) {

    //async.parallel({
    //    pset_count: function (callback) {
    //        Pset.count(callback);
    //    }
    //}, function (err, results) {
    //    res.render('psetindex', { title: 'Local Psets Home', error: err, data: results });
    //});
    Pset.find({})
        .exec(function (err, list_psets) {
            if (err) { return next(err); }
            psets=list_psets
            //Successful, so render
            res.render('psetindex', { psets: psets });
        });

};
// Display list of all books
exports.pset_list = function (req, res, next) {
    Pset.find({})
        .exec(function (err, list_psets) {
            if (err) { return next(err); }
            //Successful, so render
            res.render('psets', { psets: list_psets });
        });
};

// Display detail page for a specific book
exports.pset_detail = function (req, res, next) {
    var id = req.params.id
    async.parallel({
        pset: function (callback) {
            Pset.findById(req.params.id)
                .exec(callback);
        }
    }, function (err, results) {
        if (err) { return next(err); }
        //Successful, so render
        console.log("_id=", results.pset._id)
        var id = "" + results.pset._id
        console.log("req.url:", req.url, id, ":", id)
        if (results.pset.head)
            results.pset.head = changesrc(results.pset.head, id)
        if (results.pset.tail)
            results.pset.tail = changesrc(results.pset.tail, id)
        if (results.pset.items && results.pset.items.length > 0) {
            for (var i = 0; i < results.pset.items.length; i++) {
                if (results.pset.items[i].head)
                    results.pset.items[i].head = changesrc(results.pset.items[i].head, id)
                if (results.pset.items[i].tail)
                    results.pset.items[i].tail = changesrc(results.pset.items[i].tail, id)
                if (results.pset.items[i].choices && results.pset.items[i].choices.length > 0) {
                    for (var j = 0; j < results.pset.items[i].choices.length; j++) {
                        results.pset.items[i].choices[j] = changesrc(results.pset.items[i].choices[j], id)
                    }
                }
                if (results.pset.items[i].spaces && results.pset.items[i].spaces>0) {
                    results.pset.items[i].labels=" 1234567890–±"
                    results.pset.items[i].leadings = []
                    for (var j = 0; j < results.pset.items[i].spaces; j++) {
                        //leadings.push("\\(\\fbox{" + (i + 1) + "}\\)=")
                        results.pset.items[i].leadings.push("\\(\\ceec{" + (j + 1) + "}\\)=")
                    }
                }
            }
        }
        var espacecount
        var labels
        var errmsg
        var leadings
        var labels
        if (results.pset.espaces) {
            var tokens = results.pset.espaces.split(" ")
            if (tokens.length != 2) {
                errmsg = "token length error"
            } else {
                espacecount = parseInt(tokens[0])
                if (isNaN(espacecount) || espacecount < 1 || espacecount > tokens[1].length) {
                    errmsg = "format example: 10 ABCDEFGHIJKL"
                }
            }
            if (errmsg) {
                var err1 = new Error(errmsg);
                err1.status = 500;
                return next(err1);
            }
            leadings = []
            for (var i = 0; i < espacecount; i++) {
                //leadings.push("\\(\\fbox{" + (i + 1) + "}\\)=")
                leadings.push("\\(\\ceec{" + (i + 1) + "}\\)=")
            }
            labels=" "+tokens[1]
        }
        res.render('psetdetail', { code: results.pset.code, head: results.pset.head, items: results.pset.items, tail: results.pset.tail, leadings: leadings, spacecount: espacecount, labels: labels,psets:psets })
    });
};

exports.pset_detail_image = function (req, res, next) {
    console.log(req.params.id, req.params.medianame)
    async.parallel({
        pset: function (callback) {
            Pset.findById(req.params.id)
                .exec(callback);
        }
    }, function (err, results) {
        if (err) { return next(err); }
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
    res.render('psetcreate',{psets:psets})
};

// Handle book create on POST
exports.pset_create_post = function (req, res, next) {
    var data = req.body
    /////console.log("data=", data)
    var mypset = JSON.parse(data.pset)
    var media = []
    console.log("files.count", req.files.length)
    for (var i = 0; i < req.files.length; i++) {
        var file = req.files[i]
        console.log("files:", file.originalname, file.mimetype, file.size, file.buffer.length)
        media.push({ filename: file.originalname, mimetype: file.mimetype, content: file.buffer })
    }
    var pset = new Pset({
        code: mypset.code,
        items: mypset.items,
        head: mypset.head,
        tail: mypset.tail,
        media: media,
        espaces: mypset.espaces
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
                    res.redirect(found_code.url);
                }
                else {

                    pset.save(function (err) {
                        if (err) { return next(err); }
                        //successful - redirect to new book record.
                        /////console.log("pset.url",pset.url)
                        //res.redirect(pset.url);
                        res.redirect('/psetbank')
                    });
                }
            })
    }
    //var pset=JSON.parse(req.body.pset)
    //res.render('psetcreate',{pset:pset})
    //res.send("create get Not implement yet")
};

// Display book delete form on GET
exports.pset_delete_get = function (req, res, next) {
    res.send('NOT IMPLEMENTED: Book delete GET');
};

// Handle book delete on POST
exports.pset_delete_post = function (req, res, next) {
    res.send('NOT IMPLEMENTED: Book delete POST');
};

// Display book update form on GET
exports.pset_update_get = function (req, res, next) {
    res.send('NOT IMPLEMENTED: Book update GET');
};

// Handle book update on POST
exports.pset_update_post = function (req, res, next) {
    res.send('NOT IMPLEMENTED: Book update POST');
};
