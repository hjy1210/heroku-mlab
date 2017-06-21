///// This file is copied from nodejs-demo.
var fs = require('fs')
var xml2js = require('xml2js')
var parseString = require('xml2js').parseString;

function processXml(xmlfile) {
  fs.readFile(xmlfile, 'utf8', (err, data) => {
    if (err) throw err
    console.log(data)
    //var parseString = xml2js.parseString;
    parseString(data,(err,doc)=>{
      if (err) throw err
      console.log(doc.bookstore.book)
      console.log(JSON.stringify(doc,null,2))
    })
  })
}

var tagsToReplace = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;'
};

function safe_tags_replace(str) {
    return str.replace(/[&<>]/g, x=>tagsToReplace[x]);
}

function replaceData(data,tagname){
  // https://stackoverflow.com/questions/2824302/how-to-make-regular-expression-into-non-greedy
  var re= new RegExp('<'+tagname+'>'+'[\\s\\S]*?</'+tagname+'>','g')  // *? for non-greedy match
  return data.replace(re,x=>{
    return '<'+tagname+'>'+
      safe_tags_replace(x.substr(tagname.length+2,x.length-2*tagname.length-5))+
      '</'+tagname+'>'
  })
}

function substituteContent(data){
  var tags=['head','choices','tail']
  for (var i=0;i<tags.length;i++) {
    data=replaceData(data,tags[i])
  }
  /////console.log(data)
  return data
}

function xmlStr2jsonStr(xmlstr,callback){
    data=substituteContent(xmlstr)
    //var parseString = xml2js.parseString;
    parseString(data,(err,doc)=>{
      if (err) return callback(err)
      doc=doc.root
      var json=JSON.stringify(doc,null,2)
      return callback(null,json)
    })
}

module.exports={xmlStr2jsonStr}
