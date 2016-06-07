/**
 * Timezone setting.
 */
var time = require('time')(Date);
var d = new Date();
d.setTimezone('Asia/Tokyo');

// global variable
require('./lib/util/global');


// third party
var express = require('express');
var expressLayouts = require('express-ejs-layouts');
var expressValidator = require('express-validator')
var path = require('path');
var http = require('http');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var _ = require('underscore');
var dateformat = require('dateformat');
var multer = require('multer');

// app
var app = express();


var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var mongoose = require('mongoose');
mongoose.connect(mongodbConf.host);

// view engine setup
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('layout', 'layout/base');
app.use(expressLayouts);

app.locals._ = _;
app.locals.dateformat = dateformat;


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(multer({
  dest:__dirname+'/resource/csv/',
  onFileUploadData:function(file, data, req, res){
      //dataはBufferオブジェクト。何も指定しないとutf-8でデコードされます。
      console.log(data.toString());
  }
}

  ).any());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
// cookie設定
app.use(cookieParser());
// セッションストアを設定
app.use(session({
  secret: mongodbConf.secret,
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    collection: mongodbConf.collection,
    clear_interval:  24 * 30 * 60 * 60 // 保存期間(sec)
  }),
  cookie: {
    httpOnly: false,
    maxAge: 24 * 30 * 60 * 60 * 1000 // クッキーの有効期限(msec)
  }
}));
// validator
// app.use(expressValidator);


// logger
var logger = require('./lib/util/logger');
app.use(logger.express);

// routesSettings
var routes = require('./routes/index');
var auth = require('./routes/auth');
var error = require('./routes/error');
var top = require('./routes/top');
var reserved = require('./routes/reserved');
var gacha = require('./routes/gacha');
var download = require('./routes/download');
var announce = require('./routes/announce');

// admin mode時にrequire
var admin = require('./routes/admin');

app.use('/', routes);
app.use('/auth', auth);
app.use('/error', error);
app.use('/top', top);
app.use('/reserved', reserved);
app.use('/gacha', gacha);
app.use('/download', download);
app.use('/announce', announce);

// admin mode時にrequire
app.use('/admin', admin);

//Attached some objects and vars to request object.
app.use(function(req, res, next){
  res.setHeader("Access-Control-Allow-Origin", "*");

  var url = req.url.split('?');
  if(!url[0].match(/\.[a-zA-z0-9_.-]*$/)){
    // req.transaction = transactionManager.getTransaction('onhttp_'+ uid, true, req);
    // req.sequenceTransaction = transactionManager.getTransaction('onhttp_sequence_'+ uid, true, req);
  }
  req.currentDatetime = new Date();
  req.locals = {};
  next();
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  console.log(err);
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

// listen
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

module.exports = app;
