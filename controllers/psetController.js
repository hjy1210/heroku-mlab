var Pset = require('../models/pset');
var async = require('async');
var xmlStr2jsonStr = require('./xmljsonutil').xmlStr2jsonStr

var psets

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
            psets = list_psets
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
            psets = list_psets
            for (var i = 0; i < list_psets.length; i++) {
                arrangeData(psets[i], "pset/")
            }
            res.render('psets', { psets: psets });
        });
};

function arrangeData(pset, dir = "") {
    console.log("_id=", pset._id)
    var id = "" + pset._id
    if (dir) {
        id = dir + id
    }
    if (pset.head)
        pset.head = changesrc(pset.head, id)
    if (pset.tail)
        pset.tail = changesrc(pset.tail, id)
    if (pset.items && pset.items.length > 0) {
        for (var i = 0; i < pset.items.length; i++) {
            if (pset.items[i].head)
                pset.items[i].head = changesrc(pset.items[i].head, id)
            if (pset.items[i].tail)
                pset.items[i].tail = changesrc(pset.items[i].tail, id)
            if (pset.items[i].choices && pset.items[i].choices.length > 0) {
                for (var j = 0; j < pset.items[i].choices.length; j++) {
                    pset.items[i].choices[j] = changesrc(pset.items[i].choices[j], id)
                }
            }
            if (pset.items[i].spaces && pset.items[i].spaces > 0) {
                pset.items[i].labels = " 1234567890–±"
                pset.items[i].leadings = []
                for (var j = 0; j < pset.items[i].spaces; j++) {
                    //leadings.push("\\(\\fbox{" + (i + 1) + "}\\)=")
                    pset.items[i].leadings.push("\\(\\ceec{" + (j + 1) + "}\\)=")
                }
            }
        }
    }
    var espacecount
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
    }
}
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
        //console.log("_id=", results.pset._id)
        //var id = "" + results.pset._id
        //console.log("req.url:", req.url, id, ":", id)
        //if (results.pset.head)
        //    results.pset.head = changesrc(results.pset.head, id)
        //if (results.pset.tail)
        //    results.pset.tail = changesrc(results.pset.tail, id)
        //if (results.pset.items && results.pset.items.length > 0) {
        //    for (var i = 0; i < results.pset.items.length; i++) {
        //        if (results.pset.items[i].head)
        //            results.pset.items[i].head = changesrc(results.pset.items[i].head, id)
        //        if (results.pset.items[i].tail)
        //            results.pset.items[i].tail = changesrc(results.pset.items[i].tail, id)
        //        if (results.pset.items[i].choices && results.pset.items[i].choices.length > 0) {
        //            for (var j = 0; j < results.pset.items[i].choices.length; j++) {
        //                results.pset.items[i].choices[j] = changesrc(results.pset.items[i].choices[j], id)
        //            }
        //        }
        //        if (results.pset.items[i].spaces && results.pset.items[i].spaces > 0) {
        //            results.pset.items[i].labels = " 1234567890–±"
        //            results.pset.items[i].leadings = []
        //            for (var j = 0; j < results.pset.items[i].spaces; j++) {
        //                //leadings.push("\\(\\fbox{" + (i + 1) + "}\\)=")
        //                results.pset.items[i].leadings.push("\\(\\ceec{" + (j + 1) + "}\\)=")
        //            }
        //        }
        //    }
        //}
        //var espacecount
        //var labels
        //var errmsg
        //var leadings
        //var labels
        //if (results.pset.espaces) {
        //    var tokens = results.pset.espaces.split(" ")
        //    if (tokens.length != 2) {
        //        errmsg = "token length error"
        //    } else {
        //        espacecount = parseInt(tokens[0])
        //        if (isNaN(espacecount) || espacecount < 1 || espacecount > tokens[1].length) {
        //            errmsg = "format example: 10 ABCDEFGHIJKL"
        //        }
        //    }
        //    if (errmsg) {
        //        var err1 = new Error(errmsg);
        //        err1.status = 500;
        //        return next(err1);
        //    }
        //    leadings = []
        //    for (var i = 0; i < espacecount; i++) {
        //        //leadings.push("\\(\\fbox{" + (i + 1) + "}\\)=")
        //        leadings.push("\\(\\ceec{" + (i + 1) + "}\\)=")
        //    }
        //    labels = " " + tokens[1]
        //}
        var errmsg = arrangeData(results.pset)
        if (errmsg) {
            var err1 = new Error(errmsg);
            err1.status = 500;
            return next(err1);
        }
        res.render('psetdetail', { code: results.pset.code, head: results.pset.head, items: results.pset.items, tail: results.pset.tail, leadings: results.pset.leadings, spacecount: results.pset.espacecount, labels: results.pset.labels, psets: psets })
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
    res.render('psetcreate', { psets: psets })
};

// Handle book create on POST
exports.pset_create_post = function (req, res, next) {
   /////console.log("data=", data)
    function process(curpset) {
        var mypset = JSON.parse(curpset)
        //mypset.espaces=parseInt(mypset.espaces) ///// consider transform from xml, convert string to number
        if (mypset.items && mypset.items.length > 0) {
            for (var i = 0; i < mypset.items.length; i++) {
                if (mypset.items[i].spaces) {
                    mypset.items[i].spaces = parseInt(mypset.items[i].spaces)
                }
            }
        }
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
    }
    var data = req.body
    if (!data.pset) return next(new Error("empty pset"))
    var str = data.pset.trim()
    if (str.length === 0) return next(new Error("empty pset"))
    if (str[0]==='<'){
        xmlStr2jsonStr(str,(err,json)=>{
            if (err) return next(err)
            process(json)
        })
    } else {
        process(str)
    }
 

};

exports.pset_create_post0 = function (req, res, next) {
    var data = req.body
    if (!data.pset) return next(new Error("empty pset"))
    var str = data.pset.trim()
    if (str.length === 0) return next(new Error("empty pset"))

    /////console.log("data=", data)
    var mypset = JSON.parse(data.pset)
    //mypset.espaces=parseInt(mypset.espaces) ///// consider transform from xml, convert string to number
    if (mypset.items && mypset.items.length > 0) {
        for (var i = 0; i < mypset.items.length; i++) {
            if (mypset.items[i].spaces) {
                mypset.items[i].spaces = parseInt(mypset.items[i].spaces)
            }
        }
    }
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
