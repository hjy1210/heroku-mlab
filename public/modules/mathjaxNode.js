// a simple TeX-input example
var mjAPI = require("mathjax-node");
mjAPI.config({
  MathJax: {
    extensions: ["https://cdnjs.cloudflare.com/ajax/libs/mathjax-mhchem/3.2.0/mhchem.js"],
    TeX: {
      Macros: {
        ceec: ['{\\fbox{#1 }}', 1],
        ceece: ['\\underline{\\  {\\fbox{#1 }}\\  }', 1]
      }
    }
  }
});

mjAPI.start();

var yourMath = 'E = mc^2 \\ce{H2O}';
var myMath="\\ce{CH4(g) + H2O(g) <=>[Ni,700K] CO(g) + 3H2(g)} \\hspace{0.5cm} \\Delta H <0"
mjAPI.typeset({
  math: myMath,
  format: "TeX", // "inline-TeX", "MathML"
  mml: true, //  svg:true,
}, function (data) {
  if (!data.errors) { console.log(data.mml) }
  // will produce:
  // <math xmlns="http://www.w3.org/1998/Math/MathML" display="block">
  //   <mi>E</mi>
  //   <mo>=</mo>
  //   <mi>m</mi>
  //   <msup>
  //     <mi>c</mi>
  //     <mn>2</mn>
  //   </msup>
  // </math>
});