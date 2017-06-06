var Pset = require('../models/pset');

var async = require('async');

var data={
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
  }

exports.index = function(req, res) {   
    
    async.parallel({
        pset_count: function(callback) {
            Pset.count(callback);
        }
    }, function(err, results) {
        res.render('psetindex', { title: 'Local Psets Home', error: err, data: results });
    });
};
// Display list of all books
exports.pset_list = function(req, res, next) {
  /*Pset.find({})
    .populate('author')
    .exec(function (err, list_psets) {
      if (err) { return next(err); }
      //Successful, so render
      res.render('pset_list', { title: 'Pset List', pset_list: list_psets });
    });*/
  res.render('psets', data);
};

// Display detail page for a specific book
exports.pset_detail = function(req, res, next) {
  /*async.parallel({
    book: function(callback) {     
      Book.findById(req.params.id)
        .populate('author')
        .populate('genre')
        .exec(callback);
    },
    book_instance: function(callback) {
      BookInstance.find({ 'book': req.params.id })
        //.populate('book')
        .exec(callback);
    },
  }, function(err, results) {
    if (err) { return next(err); }
    //Successful, so render
    res.render('book_detail', { title: 'Title', book: results.book, book_instances: results.book_instance } );
  });*/
  res.render('pset', data.psets[req.params.id]);
  //res.send("Not implement yet")
};

// Display book create form on GET
exports.pset_create_get = function(req, res, next) {
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
    res.send("pset_create_get Not implement yet")

};

// Handle book create on POST
exports.pset_create_post = function(req, res, next) {
    /*req.checkBody('title', 'Title must not be empty.').notEmpty();
    req.checkBody('author', 'Author must not be empty').notEmpty();
    req.checkBody('summary', 'Summary must not be empty').notEmpty();
    req.checkBody('isbn', 'ISBN must not be empty').notEmpty();
    
    //req.sanitize('title').escape();
    req.sanitize('title');
    req.sanitize('author').escape();
    req.sanitize('summary').escape();
    req.sanitize('isbn').escape();
    req.sanitize('title').trim();     
    req.sanitize('author').trim();
    req.sanitize('summary').trim();
    req.sanitize('isbn').trim();
    req.sanitize('genre').escape();
    
    var book = new Book({
        title: req.body.title, 
        author: req.body.author, 
        summary: req.body.summary,
        isbn: req.body.isbn,
        genre: (typeof req.body.genre==='undefined') ? [] : req.body.genre.split(",")
    });
       
    console.log('BOOK: ' + book);
    
    var errors = req.validationErrors();
    if (errors) {
        // Some problems so we need to re-render our book

        //Get all authors and genres for form
        async.parallel({
            authors: function(callback) {
                Author.find(callback);
            },
            genres: function(callback) {
                Genre.find(callback);
            },
        }, function(err, results) {
            if (err) { return next(err); }
            
            // Mark our selected genres as checked
            for (i = 0; i < results.genres.length; i++) {
                if (book.genre.indexOf(results.genres[i]._id) > -1) {
                    //Current genre is selected. Set "checked" flag.
                    results.genres[i].checked='true';
                }
            }
            res.render('book_form', { title: 'Create Book',authors:results.authors, genres:results.genres, book: book, errors: errors });
        });

    } 
    else {
    // Data from form is valid.
    // We could check if book exists already, but lets just save.
    
        book.save(function (err) {
            if (err) { return next(err); }
            //successful - redirect to new book record.
            res.redirect(book.url);
        });
    }*/
    res.send("Not implement yet")
};

// Display book delete form on GET
exports.pset_delete_get = function(req, res, next) {
    res.send('NOT IMPLEMENTED: Book delete GET');
};

// Handle book delete on POST
exports.pset_delete_post = function(req, res, next) {
    res.send('NOT IMPLEMENTED: Book delete POST');
};

// Display book update form on GET
exports.pset_update_get = function(req, res, next) {
    res.send('NOT IMPLEMENTED: Book update GET');
};

// Handle book update on POST
exports.pset_update_post = function(req, res, next) {
    res.send('NOT IMPLEMENTED: Book update POST');
};
