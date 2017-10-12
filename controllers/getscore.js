//var DOMParser = require('xmldom').DOMParser;
function score(scoreInfo,itemid,node) {
  switch (node.nodeName) {
    case "responseCondition":
      score(scoreInfo,itemid,node.childNodes[0])
    case "variable":
      var id = node.getAttribute("identifier")
      if (scoreInfo[itemid].outcomes[id] != null) {
        if (typeof scoreInfo[itemid].outcomes[id]==="object"){
          return scoreInfo[itemid].outcomes[id][0]
        } else {
          return scoreInfo[itemid].outcomes[id]
        }
      } else if (scoreInfo[itemid].responses[id] != null){
        if (typeof scoreInfo[itemid].responses[id]==="object"){
          return scoreInfo[itemid].responses[id][0]
        } else {
          return scoreInfo[itemid].responses[id]
        }
       
      }
      //if (itemInfo.outcomeInfo[id]!=null) return parseFloat(itemInfo.outcomeInfo[id])
      //if (scoreInfo[itemid].responses[id] != null) return scoreInfo[itemid].responses[id][0]
      return null
      break
    case "isNull":
      var v = score(scoreInfo,itemid,node.childNodes[0])
      return (v === undefined || v === null || v.length === 0) ? true : false
    case "not":
      var v = score(scoreInfo,itemid,node.childNodes[0])
      return !v
    case "setOutcomeValue":
      //itemInfo.outcomeInfo[node.getAttribute("identifier")] = score(scoreInfo,node.childNodes[0])
      scoreInfo[itemid].outcomes[node.getAttribute("identifier")] = score(scoreInfo,itemid,node.childNodes[0])
      return
    case "sum":
      var sum = 0
      for (var i = 0; i < node.childNodes.length; i++) {
        sum += score(scoreInfo,itemid,node.childNodes[i])
      }
      return sum
    case "mapResponse":
      var mapping = scoreInfo[itemid].corrects[node.getAttribute("identifier")].mapping
      //if (typeof mapping === "string") {
      //  mapping=mapping.replace(/>\s*?</g,"><")
      //  scoreInfo[itemid].corrects[node.getAttribute("identifier")].mapping = new DOMParser().parseFromString(mapping, "text/xml").documentElement
      //  mapping = scoreInfo[itemid].corrects[node.getAttribute("identifier")].mapping
      //}
      var v = 0
      var id = node.getAttribute("identifier")
      var defaultValue = mapping.getAttribute("defaultValue")
      for (var i = 0; i < scoreInfo[itemid].responses[id].length; i++) {
        var value = defaultValue
        for (var j = 0; j < mapping.childNodes.length; j++) {
          if (mapping.childNodes[j].getAttribute("mapKey") === scoreInfo[itemid].responses[id][i]) {
            value = mapping.childNodes[j].getAttribute("mappedValue")
            break
          }
        }
        v += parseFloat(value)
      }
      return v
    case "baseValue":
      var s = node.getAttribute("baseType")
      var v = node.childNodes[0].nodeValue
      if (s === "float") v = parseFloat(v)
      return v
    case "responseElseIf":
    case "responseIf":
      var cond = score(scoreInfo,itemid,node.childNodes[0])
      if (cond) {
        score(scoreInfo,itemid,node.childNodes[1])
      } else {
        if (node.nextSibling) score(scoreInfo,itemid,node.nextSibling)
      }
      break
    case "responseElse":
      score(scoreInfo,itemid,node.childNodes[0])
      break
    case "max":
      var v = score(scoreInfo,itemid,node.childNodes[0])
      for (var i = 1; i < node.childNodes.length; i++) {
        v = Math.max(v, score(scoreInfo,itemid,node.childNodes[i]))
      }
      return v
    case "subtract":
      return score(scoreInfo,itemid,node.childNodes[0]) - score(scoreInfo,itemid,node.childNodes[1])
    case "divide":
      return score(scoreInfo,itemid,node.childNodes[0]) / score(scoreInfo,itemid,node.childNodes[1])
    case "product":
      return score(scoreInfo,itemid,node.childNodes[0]) * score(scoreInfo,itemid,node.childNodes[1])
    case "correct":
      return scoreInfo[itemid].corrects[node.getAttribute("identifier")].correctResponse[0]
    case "match":
      var v0 = score(scoreInfo,itemid,node.childNodes[0])
      var v1 = score(scoreInfo,itemid,node.childNodes[1])
      //var v0 = node.childNodes[0]
      //var v1 = node.childNodes[1]
      if (v0 == null || v1 == null || v0.length != v1.length) return false
      for (var i = 0; i < v0.length; i++) {
        if (v0[i] != v1[i]) return false
      }
      return true
    case "and":
      var res = score(scoreInfo,itemid,node.childNodes[0])
      for (var i = 1; i < node.childNodes.length; i++) {
        res = res && score(scoreInfo,itemid,node.childNodes[i])
      }
      return res
    default:
      //console.log(node)
      for (var i = 0; i < node.childNodes.length; i++) score(scoreInfo,itemid,node.childNodes[i])
  }
}
module.exports=function getScore(scoreInfo){
  var scoreResults={}
  for (x in scoreInfo){
    score(scoreInfo,x,scoreInfo[x].responseProcessing)
    //console.log(scoreInfo[x].responses)
    var purecorrects={}
    for (y in scoreInfo[x].corrects){
      purecorrects[y]=scoreInfo[x].corrects[y].correctResponse
    }
    //console.log(purecorrects)
    //console.log(scoreInfo[x].outcomes)
    scoreResults[x]={
      responses:scoreInfo[x].responses,
      corrects:purecorrects,
      outcomes:scoreInfo[x].outcomes
    }
  }
  return scoreResults
}
