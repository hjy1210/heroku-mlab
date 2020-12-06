# 2020/01/06 摘要

## mlab.com
* 在 mlab.com 我有帳號 w3im, 使用者 hjyanghj
* hjyanghj 已建立資料庫 ims
* ims 的連接字串為 `mongodb://<dbuser>:<dbpassword>@ds111791.mlab.com:11791/ims`，ims 的使用者有hjy,hjy2,hjyang三位，各有各的密碼。

## 資料庫設定
app.js 裡面有一行
```
var mongoDB = process.env.MONGODB_URI || "mongodb://localhost:27017/conFusion"
```
代表可用環境變數 MONGODB_URI 來儲存mongodb資料庫的連接字串。可用前一節mlab.com裡的ims資料庫的任一使用者來設定連接字串。


## 啟動 express server
* 用 Visual Studio Code 開啟 HEROKU-MLAB 資料夾
* Terminal >  Run Task > npm:dev
## 瀏覽 
* 用瀏覽器瀏覽 http://localhost:3000/
* 選取 All Cmls, Create new cml, Cml Test Form
* All Psets, Create new pset, Pset Test Form, All Qtis, Create new qti, Qti Test Form 等選項仍未完成

## 新增 cml 題組
* 在 qti-demo 中，用 `node scripts\cml2json sat2_phy_2016_03.cml` 指令，由 `sat2_phy_2016_03.cml` 產生 `sat2_phy_2016_03.json, sat2_phy_2016_03.xml, sat2_phy_2016_03.zip`。
* 用瀏覽器瀏覽 http://localhost:3000/
* 選取 `Create New Cml`，選擇檔案 `sat2_phy_2016_03.json`，按上傳按鈕，完成一題組的上傳。
* 在 qti-demo 中，batchcml2json.bat 可用來批次將 .cml 檔轉檔成 json,xml,zip檔。
* http://localhost:3000/cmlbank/qtitestform, random sample 5 items as a testfrom.

## Heroku-Mlab
目前在[heroku.com](https://guarded-gorge-99572.herokuapp.com/psetbank/testform) 的版本為 2017/06/30 提交的 64f75b3d 版本。

# express
## nodemon
Package nodemon can be used to monitor the changes of your website.

Any changes you make to your Express website are currently not visible until you restart the server. It quickly becomes very irritating to have to stop and restart your server every time you make a change, so it is worth taking the time to automate restarting the server when needed.

One of the easiest such tools for this purpose is nodemon. This is usually installed globally (as it is a "tool"), but here we'll install and use it locally as a developer dependency, so that any developers working with the project get it automatically when they install the application.

## express-generator

## body-parser

## cookie-parser

## debug

## morgan

## serve-favicon

## mongoose

## mlab

## pug

We can learn pug from [docs on pug](https://pugjs.org/api/getting-started.html).

## async

## moment

## express-validator

## helmet

## [best practice performance](https://expressjs.com/en/advanced/best-practice-performance.html)

## [best practice security](https://expressjs.com/en/advanced/best-practice-security.html)

# bootstrap

.text-muted, .text-primary, .text-success, .text-info, .text-warning, and .text-danger .text-left .text-center .text-justify .text-nowrap .lead .small

.bg-primary, .bg-success, .bg-info, .bg-warning, and .bg-danger

.pre-scrollable .list-inline .list-unstyled .dl-horizontal

table : .table .table-striped .table-bordered .table-hover .table-condensed .table-responsive

tr td: .active .sucess .info .warning .danger

img: .img-rounded .img-circle .img-thumbnail .img-responsive

embed: .embed-responsive .embed-responsive-16by9 .embed-responsive-item

div: .jumbotron .page-header .well .well-lg .well-sm .alert .alert-success .alert-info .alert-warning .alert-danger .alert-dismissable .fade .in .btn-group .btn-group-lg .btn-group-vertical .btn-group-justified

a: .alert-link .close

a, button, input: .btn .btn-default .btn-primary .btn-success .btn-info .btn-warning .btn-danger .btn-link .btn-lg .btn-md ,btn-sm .btn-xs .btn-block

span: .glyphicon .glyphicon-*name* .badge .label .label-default .label-primary

div: .progress .progress-bar .progress-bar-success .progress-bar-striped .active

# heroku-mlab
use heroku as paas and mlab as daas

## Steps to use heroku and mlab
`heroku create`

This creates a git remote ("pointer to a remote repository") named heroku in our local git environment.

`git push heroku master`

This will upload the app to heroku, get all its dependencies, package it in a dyno, and start the site.


`heroku config:set NODE_ENV=production`

This set NODE_ENV to 'production' in order to improve our performance 

`heroku config:set MONGODB_URI=mongodb://<dbusername>:<dbpassword>@ds111791.mlab.com:11791/ims`

This use a separate database for production, setting its URI in the MONGODB_URI  environment variable. Note: URI should not be encloded in quotation mark.

`heroku config`

This display configuration

`heroku open`

This open the website.

## MathJax
**For math formula, IE is much slower than chrome.**

## Progress
* create pset
* display psets as list
* display pset detail
* save image as Buffer in mongoDB
* 2017/06/09 Add feature: can add image with `<img src='carbonemission.png'>`
* 2017/06/12 Add feature `<audio src='example1/mp3' controls>`
* 2017/06/12 Add feature `item.spaces` for spacefill item in mathematics.
* 2017/06/13 Note: JSON file can not have '\t' character
* 2017/06/13 Add feature `pset.espaces` for item in english item. Fix server crash bug.
* [List of commands supported by mathjax](http://docs.mathjax.org/en/latest/tex.html#tex-commands) show mathjax support \fbox, \hspace, \bbox,..., etc.
* 2017/06/16 relaese two route: /psetbank, /psetbank/psets Version:8d7f7549
* 2017/06/16 close /pset/create with get and post methods temporaryly for release
* 2017/06/16 add arrangeData
* 2017/06/21 可以直接用xml的格式輸入題組
* 2017/06/22 create pset 的時候略為詳細檢查
* 2017/06/26 將英文科的科漏字用@ABCDEFGHIJKL@的方式呈現，不在需要"10 ABCDEFGHIJKL"的espaces
* 2017/06/26 將數學科的選填題改成不需要 spaces,直接計數\ceec{\d+}來得到，避免互相矛盾
* 2017/06/26 增加stdans,格式為陣列，每一元素代表一題,用逗點隔開。每一題的格式為<ans>:<type>:<score>，
  其中 type為S(代表單選)M(代表多選)F(代表選填)。
  * [B:S:2] 代表單選題，配分2分，正答為B
  * [AC:M:5] 代表多選題，配分5分，正答為AC
  * [314:F:6] 代表選填題，配分6分，正答為314
  * [K:S:1,E:S:1,J:S:1,F:S:1,G:S:1,I:S:1,B:S:1,H:S:1,A:S:1,D:S:1] 代表由10題組成的題組，全是單選題，
  每題配分1分，正答分別是K,E,J,....。
* 2017/06/26:每個題目的input要給定不同的name或id。
* 2017/06/27 pset 的模型已經更改，增加stdans,移除spaces,espaces
* 2017/06/29 增加 testform_get, testform_post, 完成計分報告，release V0.1
* Todo: check as detail as possible can avoid server crash for example: file upload and json content not in consistent. 

# Pset Model
Pset 的 mongoose 模型如下:
```
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PsetSchema = Schema({
  code:{type:String,required:true},
  stdans:[{ans:{type:String,required:true},
    score:{type:Number,required:true},
    type:{type:String,required:true}}],
  head: {type: String},
  tail:{type:String},
  items: [{
    head: {type: String},
    tail:{type:String},
    choices: [{type: String,required: true}]
  }],
  media:[{
    filename:{type:String, required:true},
    mimetype:{type:String},
    content:{type:Buffer, required:true}
  }]
});

// Virtual for book's URL
PsetSchema
.virtual('url')
.get(function () {
  return '/psetbank/pset/' + this.code;
});
PsetSchema
.virtual('mediacount')
.get(function () {
  if (this.media){
    return this.media.length
  } else {
    return 0
  }
});

module.exports = mongoose.model('Pset', PsetSchema);
```
其中的 stdans為標準答案資料陣列，每一元素代表題組的一小題，元素的 type 有4種可能，'S','M','K','F'，分別代表單選、多選、克漏、選填題。元素的ans為標準答案，元素的score為配分。

# Pset XML
題組用XML格式輸入，其格式如下
```
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<root>
  <code>sat2_eng_2016_16_20</code>
  <stdans>[D:K:1,D:K:1,A:K:1,B:K:1,C:K:1]</stdans>
  <head>
    ...
  </head>
  <items>
    <head>
      ...
    </head>
    <choices>...</choices>
    <choices>...</choices>
    <choices>...</choices>
    <choices>...</choices>
    <tail>
      ...
    </tail>
  </items>
  <tail>
    ...
  </tail>
</root>
```
其中的

* /root/head裡面輸入題組相關的敘述，英文科的克漏字用 @ABCDEFGHIJKL@ 來表示。
* /root/items/head裡面輸入小題相關的提示，數學科的選填題用 \(\frac{\ceec{1}}{\ceec{2}\ceec{3}}\) 的方式呈現。
* /root/items/choices裡面輸入小題的選項。
* /root/items/tail裡面輸入小題相關的補充。
* /root/tail裡面輸入題組相關的補充。
* head,tail,choices等，都可以用html的element來格式化內容，例如用`<strong>沒有</strong>`來粗體"沒有"，用`<p style='font-family:標楷體;'>...</p>`來使用楷書字體。但要加入圖形，限定格式為`<img src='...' ... />`(注意，必須使用英文的單引號)，要加入音檔，限定格式為`<audio src='...' ... />`(注意，必須使用英文的單引號)。可到 w3schoole 的[HTML5 Tutorial](https://www.w3schools.com/html/) 練習html語法。
* head,tail,choices等，都可以用mathjax格式輸入數學符號、化學反應式(\ce{...})、物理單位(\pu{...})等。注意：數學符號的 `<` 後面應該加上一個空白，避免與html的格式相衝突。[List of commands supported by mathjax](http://docs.mathjax.org/en/latest/tex.html#tex-commands)列有mathjax支援的指令。
* 除了/root，/root/code, /root/stdans 外，每一個節點都可能從缺。例如英文科的克漏字題組，只需要/code/head。一個小題構成的題組的時候，只需要 /root/items。

# Create item steps

1. 輸入xml格式的題目檔案，題目所需的附件(如圖檔與音檔)
2. 用 xmlStr2jsonStr，將xml格式的字串，轉換成json格式的字串。
    1. 用 substituteContent，將 head，tail, choices 節點裡面的字元 `<`,`&`,`>` 編碼，方便後面的分析。
    2. 將xml格式的字串解析成json object，將該物件的stdans字串再解析成物件。
    3. 將前述的物件再轉換成JSON字串。
3. 用 process，將JSON字串轉成Pset模型適用的json object，再存入mongo資料庫
    1. 用cleanPset，將code,head,tail等屬性清理。若是長度為1的字串陣列，改成只有內含的的字串，接著，若是該字串trim()之後為空字串，刪除該屬性。
    2. 分析req.files(附件檔案)，建構屬性media。
    3. 用Pset產生mongoose 物件，若該物件的code在資料庫中已經出現，答覆不能重複，否則加入資料庫。

# QTI
* assessmentItem 的 XML 檔案，可用[XML Validator - XSD (XML Schema)](https://www.freeformatter.com/xml-validator-xsd.html)來檢查是否Well-formed and valid。

* assessmentItem 也可以用套件 xsd-schema-validator(在controllers/modules/xmlutils.js裡實作validate) 加以validate，可惜速度有點慢。
* [QTI samples](https://webapps.ph.ed.ac.uk/qtiworks/anonymous/samples)中，可以看到QTI samples的實作，透過view page source，可以看到個個xxxInteraction的UI實作以及評分的javascript。
* 2017/07/06 開始用xmldom解析QTI item.
* 2017/07/07 開始分析QTI的itemBody
* 2017/07/17 安裝XAMPP+TAO(zip)
* 2017/07/19 XAMPP+TAO(Zip) 的兩個問題
    * import QTI Iiem的zip檔的時候，會出現一些奇怪的警告
    * 考試開始時，出現錯誤 `Fatal error: Cannot use qtism\common\datatypes\Float as Float because 'Float' is a special class name in D:\xampp\htdocs\tao310\taoQtiTest\helpers\class.TestSession.php on line 31`
* 2017/07/19 用TAO binary version編item,import item, construct test, deliver test, execute test 完全正常。以後應該只使用TAO binary version

## mhchem.js is an extension of mathjax 

## exams in R
exams is a R package, which can be used to generate tests in many formats: PDF, Html, Moodle XML, QTI XML.

Although, right now still have some issues, we can use to study QTI 2.1 specicication.

Qti21.zip is created from example in exams, although compress manually to produce.

Qti21_short.zip make some modifications on xml files to pass qtiwork validating.

## TAO
We can use TAO to generate QTI2.1 testitems, compose QTI2.1 tests, deliver tests, let students take tests, export test results.

TAO items can geneate contents with mathematicsl formula, but cannot generate contents with chemical equation.

## QTIWorks
We can use QTIWorks to validate/run QTI2.1 items, tests.

It expose useful informations when validation is fail.

We can use it to check is customed responseProcessing correct.

## mathjax-node
TAO can not generate contents with chemical equations. 

We can use mathjax-node to produce mathmml code from latex source code with chemical/mathematical formula. mathjaxNode.js is a demo.

Code generated by mathjax-node can be browsed directly in firefox, although not perfect.

If we put  `<script src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.0/MathJax.js?config=MML_HTMLorMML" type="text/javascript"></script>` in head section, mathmml code can display sufficiently beautiful math formula in all browsers.

heroku-mlab/public/mhchem.html is an example.

Put in QtiWorks, after `<mpadded height="0">` change to  `<mpadded height="0px">`, display correctly.

Put in TAO, even `<mpadded height="0">` changed to  `<mpadded height="0px">`, display still not correct.


## ckeditor
TAO use ckeditor to edit testItem.

It is time to study using ckeditor as front-end editor for QTIItem.

cjkeditor + mathjax-node + mathjax + javascript is the future.

## moodle+mathjax+mhchem.js

從 [MoodleWindowsInstaller-latest-33.zip](https://download.moodle.org/download.php/windows/MoodleWindowsInstaller-latest-33.zip) 下載 MoodleWindowsInstaller-latest-33.zip，解壓縮到適當的目錄，例如d:\moodle-33。

Moodle 與 TAO 都是使用 Apache+PHP+MySql，若兩者都安裝在同一台機器上，必須解決port相衝突的問題。

Moddle的預設安裝，Apache使用tcp 80,443，MySql使用tcp 3306。

TAO的預設安裝，Apache使用tcp 89，MySql使用tcp 3306。

為了解決MySql的衝突，將 Moodle 的 MySql port 改成 3305，方法如下：

* 點擊 server\xampp-control.exe，點擊 XAMPP control pane l的Apache > Config 按鈕，選取PHP(php.ini)項目
  * 將 mysqli.default_port = 3306 改成 mysqli.default_port = 3305
  * 將 mysql.default_port=3306 改成 mysql.default_port=3305
* 點擊 XAMPP control panel 的 MySql > Config 按鈕，選取my.ini項目
  * 將 [client] 裡面的 port=3306 改成 port=3305
  * 將 [mysqld] 裡面的 port=3306 改成 port=3305


管理者用來開創線上學校，老師用來開課，學生用來學習。

要設定moodle可以顯示數學與化學方程式，請依下列步驟：

* Administration > Site administration > Plugins > Filters > Manage filters 將 mathjax filter 啟用，並設定mathjax的URL。
* 編輯 Administration > Site administration > Plugins > Filters > MathJax > MathJax configuration，加入 TeX: { extensions: ["AMSmath.js","AMSsymbols.js","mhchem.js","noErrors.js","noUndefined.js"] },
* 相關課程  Administration > Course administration > Filters，將 mathjax filter 啟用

## TAO
從 [TAO_3.1.0-RC7_Windows_setup.exe](https://www.taotesting.com/get-tao/official-tao-packages/) 下載 TAO_3.1.0-RC7_Windows_setup.exe。

點擊 TAO_3.1.0-RC7_Windows_setup.exe 進行Tao的安裝，例如安裝到 d:\xamppWithTAO。

要讓Tao可以用latex語法輸入數學公式：

* Following the instruction appeared in 
[enable-math-expression-in-items](https://hub.taocloud.org/articles/third-party-tools-and-libraries/enable-math-expression-in-items),
* download [mathjax-shrunk.zip](https://hub.taocloud.org/resources/taohub-articles/articles/third-party/mathjax-shrunk.zip) and 
* unzip its content at subdirectory d:\xamppWithTao\htdocs\taoQtiItem\views\js\mathjax
Tao installer package for Windows

Note: TAO 無法輸入化學公式。

## Tao, Moodle coorperate by LTI
Following [how-to-deliver-a-test-using-lti](https://hub.taocloud.org/articles/tutorials/how-to-deliver-a-test-using-lti),
we can let moodle use external tool provided by tao to perform examinations.

## qti-demo-cml2json
cml2json.js is a library function in qti-demo project.

use cml2json.js to convert cml file to jsonfile

## Status
1. create item in json format
    * edit cml file: sat2_bio_2016_10_11.cml
    * `node scripts\cml2json sat2_bio_2016_10_11.cml` generate sat2_bio_2016_10_11.json 
2. In heroku-mlab web site
    * http://localhost:3000/cmlbank/qti/create, upload sat2_bio_2016_10_11.json as a cml item.
    * http://localhost:3000/cmlbank/qtitestform, random sample 5 items as a testfrom.

## QTI3.0
2020/12/6 以前用 getscore21.js(getscore.js), cmlController21.js(cmlController.js) 搭配 QTI2.1 (qti-demo)的 cml/json。
2020/12/6 以後用 getscore30.js, cmlController30.js 搭配 QTI3.0(qti-demo) 的 cml/json。

目前的評分，適用於
* qti-choice-interaction 單選題與多選題
* qti-inline-choice-interaction 英文綜合測驗 inline單選
* qti-group-inline-choice-interaction 選填題
* qti-gap-match-interaction 英文文意選填 空格配對
