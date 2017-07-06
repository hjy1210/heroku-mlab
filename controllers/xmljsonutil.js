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

// 將str中的'&','<','>'字元編碼成&xx;
function safe_tags_replace(str) {
  return str.replace(/[&<>]/g, x => tagsToReplace[x]);
}

//將字串data中，<tagname>的內容加以編碼，如此裡面不再有節點。需要用non-greedy搜尋。
function replaceData(data, tagname) {
  // https://stackoverflow.com/questions/2824302/how-to-make-regular-expression-into-non-greedy
  var re = new RegExp('<' + tagname + '>' + '[\\s\\S]*?</' + tagname + '>', 'g')  // *? for non-greedy match
  return data.replace(re, x => {
    return '<' + tagname + '>' +
      safe_tags_replace(x.substr(tagname.length + 2, x.length - 2 * tagname.length - 5)) +
      '</' + tagname + '>'
  })
}

//將字串data中，<head>,<choices>,<tail>裡面的內容加以編碼，變成字串而已
function substituteContent(data) {
  var tags = ['head', 'choices', 'tail']
  for (var i = 0; i < tags.length; i++) {
    data = replaceData(data, tags[i])
  }
  /////console.log(data)
  return data
}

//將 xml 格式的字串改成 json格式的字串，<head>,<choices>,<tail>裡面只有文字,
//沒有節點。若再透過JSON.parse轉換後，obj.stdan已經是object。
function xmlStr2jsonStr(xmlstr, callback) {
  data = substituteContent(xmlstr)
  //var parseString = xml2js.parseString;
  // 將xml格式的字串改成json格式的字串
  parseString(data, (err, doc) => {
    if (err) return callback(err)
    doc = doc.root
    // 將doc.stdans的格式由字串改成json物件
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

function nodeInfo(node, prefix = "") {
  var str = prefix + node.nodeName + "\n"
  var i
  if (node.attributes) {
    for (i = 0; i < node.attributes.length; i++) {
      str += `${prefix}  ${node.attributes[i].nodeName}:${node.attributes[i].nodeValue}` + "\n"
    }
  }
  if (node.childNodes) {
    for (i = 0; i < node.childNodes.length; i++) {
      if (node.childNodes[i].nodeName != "#text") {
        str += nodeInfo(node.childNodes[i], prefix + "  ")
      } else {
        var v = node.childNodes[i].nodeValue.trim()
        if (v !== "") str += prefix + "  " + v + "\n"
      }
    }
  }
  return str
}

module.exports = { xmlStr2jsonStr, parseStdAns,nodeInfo }
