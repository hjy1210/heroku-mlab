//var DOMParser = require('xmldom').DOMParser;
function score(scoreInfo, itemid, node) {
	switch (node.nodeName) {
		case 'qti-response-condition':
			score(scoreInfo, itemid, node.childNodes[0]);
		case 'qti-variable':
			var id = node.getAttribute('identifier');
			if (scoreInfo[itemid].outcomes[id] != null) {
				//if (typeof scoreInfo[itemid].outcomes[id]==="object"){
				//  return scoreInfo[itemid].outcomes[id][0]
				//} else {
				//  return scoreInfo[itemid].outcomes[id]
				//}
				return scoreInfo[itemid].outcomes[id];
			} else if ((scoreInfo[itemid].responses[id] != null) && (scoreInfo[itemid].responses[id].length != 0)) {
				//if (typeof scoreInfo[itemid].responses[id]==="object"){
				//  return scoreInfo[itemid].responses[id][0]
				//} else {
				//  return scoreInfo[itemid].responses[id]
				//}
				return scoreInfo[itemid].responses[id];
			}
			//if (itemInfo.outcomeInfo[id]!=null) return parseFloat(itemInfo.outcomeInfo[id])
			//if (scoreInfo[itemid].responses[id] != null) return scoreInfo[itemid].responses[id][0]
			return null;
			break;
		case 'qti-is-null':
			var v = score(scoreInfo, itemid, node.childNodes[0]);
			return v === undefined || v === null || v.length === 0 ? true : false;
		case 'qti-not':
			var v = score(scoreInfo, itemid, node.childNodes[0]);
			return !v;
		case 'qti-set-outcome-value':
			//itemInfo.outcomeInfo[node.getAttribute("identifier")] = score(scoreInfo,node.childNodes[0])
			var v = score(scoreInfo, itemid, node.childNodes[0])
			scoreInfo[itemid].outcomes[node.getAttribute('identifier')] = v;
			return;
		case 'qti-sum':
			var sum = 0;
			for (var i = 0; i < node.childNodes.length; i++) {
				sum += score(scoreInfo, itemid, node.childNodes[i]);
			}
			return sum;
		case 'qti-map-response':
			var mapping = scoreInfo[itemid].corrects[node.getAttribute('identifier')]['qti-mapping'];
			//if (typeof mapping === "string") {
			//  mapping=mapping.replace(/>\s*?</g,"><")
			//  scoreInfo[itemid].corrects[node.getAttribute("identifier")].mapping = new DOMParser().parseFromString(mapping, "text/xml").documentElement
			//  mapping = scoreInfo[itemid].corrects[node.getAttribute("identifier")].mapping
			//}
			var v = 0;
			var id = node.getAttribute('identifier');
			var defaultValue = mapping.getAttribute('default-value');
			var responses = scoreInfo[itemid].responses[id];
			if (!(responses instanceof Array)) responses = [ responses ]; //  單選題也可以用mapping
			for (var i = 0; i < responses.length; i++) {
				var value = defaultValue;
				for (var j = 0; j < mapping.childNodes.length; j++) {
					if (mapping.childNodes[j].getAttribute('map-key') === responses[i]) {
						value = mapping.childNodes[j].getAttribute('mapped-value');
						break;
					}
				}
				v += parseFloat(value);
			}
			return v;
		case 'qti-base-value':
			var s = node.getAttribute('base-type');
			var v = node.childNodes[0].nodeValue;
			if (s === 'float') v = parseFloat(v);
			return v;
		case 'qti-response-else-if':
		case 'qti-response-if':
			var cond = score(scoreInfo, itemid, node.childNodes[0]);
			if (cond) {
				score(scoreInfo, itemid, node.childNodes[1]);
			} else {
				if (node.nextSibling) score(scoreInfo, itemid, node.nextSibling);
			}
			break;
		case 'qti-response-else':
			score(scoreInfo, itemid, node.childNodes[0]);
			break;
		case 'qti-max':
			var v = score(scoreInfo, itemid, node.childNodes[0]);
			for (var i = 1; i < node.childNodes.length; i++) {
				v = Math.max(v, score(scoreInfo, itemid, node.childNodes[i]));
			}
			return v;
		case 'qti-subtract':
			return score(scoreInfo, itemid, node.childNodes[0]) - score(scoreInfo, itemid, node.childNodes[1]);
		case 'qti-divide':
			return score(scoreInfo, itemid, node.childNodes[0]) / score(scoreInfo, itemid, node.childNodes[1]);
		case 'qti-product':
			return score(scoreInfo, itemid, node.childNodes[0]) * score(scoreInfo, itemid, node.childNodes[1]);
		case 'qti-correct':
			return scoreInfo[itemid].corrects[node.getAttribute('identifier')]['qti-correct-response'];
		case 'qti-match':
			var v0 = score(scoreInfo, itemid, node.childNodes[0]);
			var v1 = score(scoreInfo, itemid, node.childNodes[1]);
			//var v0 = node.childNodes[0]
			//var v1 = node.childNodes[1]
			if (v0 == null || v1 == null || v0.length != v1.length) return false;
			for (var i = 0; i < v0.length; i++) {
				if (v0[i] != v1[i]) return false;
			}
			return true;
		case 'qti-and':
			var res = score(scoreInfo, itemid, node.childNodes[0]);
			for (var i = 1; i < node.childNodes.length; i++) {
				res = res && score(scoreInfo, itemid, node.childNodes[i]);
			}
			return res;
		default:
			//console.log(node)
			for (var i = 0; i < node.childNodes.length; i++) score(scoreInfo, itemid, node.childNodes[i]);
	}
}
module.exports = function getScore(scoreInfo) {
	var scoreResults = {};
	for (x in scoreInfo) {
		score(scoreInfo, x, scoreInfo[x].responseProcessing);
		//console.log(scoreInfo[x].responses)
		var purecorrects = {};
		for (y in scoreInfo[x].corrects) {
			purecorrects[y] = scoreInfo[x].corrects[y]['qti-correct-response'];
		}
		//console.log(purecorrects)
		//console.log(scoreInfo[x].outcomes)
		scoreResults[x] = {
			responses: scoreInfo[x].responses,
			corrects: purecorrects,
			outcomes: scoreInfo[x].outcomes
		};
	}
	return scoreResults;
};
