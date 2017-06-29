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
  其中 type為S(代表單選)M(代表多選)F(代表選填)，單或多選時 ans為單一字母，選填時 ans 為答案字母構成的陣列。
  * [B:S:2] 代表單選題，配分2分，正答為B
  * [AC:M:5] 代表多選題，配分5分，正答為AC
  * [314:F:6] 代表選填題，配分6分，正答為314
  * [K:S:1,E:S:1,J:S:1,F:S:1,G:S:1,I:S:1,B:S:1,H:S:1,A:S:1,D:S:1] 代表由10題組成的題組，全是單選題，
  每題配分1分，正答分別是K,E,J,....。
* 2017/06/26:每個題目的input要給定不同的name或id。
* 2017/06/27 pset 的模型已經更改，增加stdans,移除spaces,espaces
* 2017/06/29 增加 testform_get, testform_post, 完成計分報告
* Todo: check as detail as possible can avoid server crash for example: file upload and json content not in consistent. 


