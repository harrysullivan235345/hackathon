var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session')
var fileUpload = require('express-fileupload')
var cron = require('node-cron')

var index = require('./routes/index');
var users = require('./routes/users');
var posts = require('./routes/posts');
var group = require('./routes/group');

var postController = require('./controllers/posts')

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'storage')));

mongoose.connect('mongodb://127.0.0.1:27017/SocialNetwork?gssapiServiceName=mongodb', {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });

app.use(session({
  secret: 'stonks go brrrrrrrrr',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}));

app.use(fileUpload());

app.use('/', index);
app.use('/users', users);
app.use('/posts', posts);
app.use('/groups', group);

// cron.schedule('*/5 * * * *', postController.clear);
    

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(process.env.PORT || 3000, () => console.log('Running on port 3000'));

module.exports = app;
