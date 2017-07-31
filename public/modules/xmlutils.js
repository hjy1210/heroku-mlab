var DOMParser = require('xmldom').DOMParser;
var fs = require('fs')
var xml2js = require('xml2js')

function qti2Json(qtixml, cb) {
  xml2js.parseString(qtixml,
    {},
    (err, json) => {
      if (err) cb(err)
      cb(null, json)
    })
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

function test() {

  var xmldata = fs.readFile(process.argv[2], "UTF-8", (err, data) => {
    var parser = new DOMParser()
    if (err) return console.log(err)
    //var xmldoc = parser.parseFromString(data, "text/xml").documentElement
    //console.log(nodeInfo(xmldoc))
    qti2Json(data, (err, json) => {
      if (err) console.log(err)
      console.log(JSON.stringify(json, null, 2))
    })
  })
}

function validate(xsdfile, xmlfile) {
  var validator = require('xsd-schema-validator');
  validator.validateXML({ file: xmlfile }, xsdfile, function (err, result) {
    if (err) {
      console.log(err)
    }
    console.log(result)
  });
}

function test1() {
  validate(process.argv[2], process.argv[3])
}
