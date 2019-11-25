var createError = require('http-errors')
var express = require('express')
var path = require('path')
var logger = require('morgan')
var ejs = require('ejs')

var indexRouter = require('./routes/index')

var app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
//app.set('view engine', 'jade');
//app.engine('html',ejs._express);
app.set('view engine', 'ejs')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))
//app.use(express.static(__dirname + './public'));
app.use('/', indexRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404))
})

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}
  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

//读取本地配置文件
// var config = require('json/type.json');

//创建get接口，读取本地配置文件
// app.get('/api', function(req, res) {

//     var file = path.join(__dirname, 'json/type.json'); //文件路径，__dirname为当前运行js文件的目录

//     //读取json文件
//     fs.readFile(file, 'utf-8', function(err, data) {
//         if (err) {
//             res.send('文件读取失败');
//         } else {
//             res.send(data);
//         }
//     });
//     //res.json({config:app.locals.config});
// });

//设置跨域访问
app.all('*', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'X-Requested-With')
  res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS')
  res.header('X-Powered-By', ' 3.2.1')
  res.header('Content-Type', 'application/json;charset=utf-8')
  next()
})

module.exports = app
