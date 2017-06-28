///// This file is copied from nodejs-demo.
var fs = require('fs')
var xml2js = require('xml2js')
var parseString = require('xml2js').parseString;

function processXml(xmlfile) {
  fs.readFile(xmlfile, 'utf8', (err, data) => {
    if (err) throw err
    console.log(data)
    //var parseString = xml2js.parseString;
    parseString(data, (err, doc) => {
      if (err) throw err
      console.log(doc.bookstore.book)
      console.log(JSON.stringify(doc, null, 2))
    })
  })
}

var tagsToReplace = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;'
};

function safe_tags_replace(str) {
  return str.replace(/[&<>]/g, x => tagsToReplace[x]);
}

function replaceData(data, tagname) {
  // https://stackoverflow.com/questions/2824302/how-to-make-regular-expression-into-non-greedy
  var re = new RegExp('<' + tagname + '>' + '[\\s\\S]*?</' + tagname + '>', 'g')  // *? for non-greedy match
  return data.replace(re, x => {
    return '<' + tagname + '>' +
      safe_tags_replace(x.substr(tagname.length + 2, x.length - 2 * tagname.length - 5)) +
      '</' + tagname + '>'
  })
}

function substituteContent(data) {
  var tags = ['head', 'choices', 'tail']
  for (var i = 0; i < tags.length; i++) {
    data = replaceData(data, tags[i])
  }
  /////console.log(data)
  return data
}

function xmlStr2jsonStr(xmlstr, callback) {
  data = substituteContent(xmlstr)
  //var parseString = xml2js.parseString;
  parseString(data, (err, doc) => {
    if (err) return callback(err)
    doc = doc.root
    var s = parseStdAns(doc.stdans)
    if (typeof s === "string") return callback(new Error(s))
    doc.stdans = s
    var json = JSON.stringify(doc, null, 2)
    return callback(null, json)
  })
}
// parse string in StdAns format for use in heroku-mlab project
// return error string or instance of StaAns 
function parseStdAns(str) {
  if (typeof str === 'string') {
    str = str.trim()
  } else {
    str = str[0].trim()
  }
  if (str.length < 3 || str[0] != "[" || str[str.length - 1] != "]") {
    return `${str} should be in the form as [.....]`
  }
  str = str.substr(1, str.length - 2)
  var tokens = str.split(',')
  var stdans = []
  for (var i = 0; i < tokens.length; i++) {
    var item = {}
    var tokens2 = tokens[i].trim().split(':')
    if (tokens2.length != 3) {
      return `${i + 1}-th problem item ${tokens[i]} should be of form x:y:z`
    }
    if ('SMKF'.indexOf(tokens2[1]) < 0) {
      return `type of ${i + 1}-th problem item is ${tokens2[1]}, not one of SMKF`
    }
    item.type = tokens2[1]
    var score = parseInt(tokens2[2])
    if (!score > 0) {
      return `score of ${i + 1}-th problem item is ${tokens2[2]}, not positive integer`
    }
    item.score = score
    var inner = tokens2[0].trim()
    if (inner.length < 1) {
      return `answer of ${i + 1}-th problem item is ${inner}, can not be empty`
    }
    for (var j = 0; j < inner.length; j++) {
      if (!inner[j].match(/[A-Z0-9\-#]/)) {
        return `answer of ${i + 1}-th problem item is ${inner}, has illegal character ${inner[j]}`
      }
    }
    item.ans = inner
    stdans.push(item)
  }
  return stdans
}

module.exports = { xmlStr2jsonStr, parseStdAns }
