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



