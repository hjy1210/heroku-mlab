var DOMParser = require('xmldom').DOMParser
var XMLSerializer = require('xmldom').XMLSerializer
var fs=require('fs')

module.exports=function jsons2html(jsons){
  var i,j,j,styleContent,identifier,div,divContent
  var identifiers=[]
  var testInfo={}
  for (i=0;i<jsons.length;i++){
    identifier=jsons[i].identifier //`qti_item_${i+1}`
    identifiers.push(identifier)
    testInfo[identifier]={responseInfo:jsons[i].responseInfo,
      styleContent:jsons[i].styleContent,html:jsons[i].html}
  }
  divContent=""
  styleContent=""
  for (i=0;i<jsons.length;i++){
  //console.log(new XMLSerializer().serializeToString(div))
    identifier=identifiers[i]
    styleContent += testInfo[identifier].styleContent.replace(/[^}]*?{/g, x => `#${identifier} ${x}`)+"\n"
    div=testInfo[identifier].html
    divnode=new DOMParser().parseFromString(div).documentElement
    ////////// find all element with attribute name, prepend identifier+"_"
    //var elements=divnode.querySelectorAll("*[name]")
    //for (j=0;j<elements.length;j++) elements[j].setAttribute('name',identifier+"_"+elements[j].getAttribute("name"))
    divnode.setAttribute("id",identifier)
    divContent+=`<h2>${identifier}</h2>\n`+new XMLSerializer().serializeToString(divnode)+"\n"
  }
  for (var id in testInfo){
    testInfo[id]["styleContent"]=""
    testInfo[id]["html"]=""
    for (var name in testInfo[id].responseInfo){
      testInfo[id].responseInfo[name]=""
    }

  }
  var testInfoStr=JSON.stringify(testInfo,null,2)
  return{testInfoStr,styleContent,divContent}
}
