var fs = require('fs')
var multer = require('multer')
var express = require('express')
var path = require('path')
var router = express.Router()
var bodyParser = require('body-parser')
var urlencodedParser = bodyParser.urlencoded({ extended: false })

//配置文件方式
// var file = './/config/type.json';
// var config;
// //读取json文件
// fs.readFile(file, 'utf-8', function(err, data) {
//     if (err) {
//         res.send('文件读取失败');
//     } else {
//         //res.send(data);
//         config=data;
//     }
// });

//node方式
var config = require('../config')
var types = config.types

let storage = multer.diskStorage({
  destination: function(req, file, cb) {
    // 文件初始路径
    const date = new Date();
    const toPad2 = num => num.padStart(2, '0');
    const filePath = `./public/uploadimg/${date.getFullYear()}${toPad2(`${date.getMonth() + 1}`)}${toPad2(
      `${date.getDate()}`)}_images`;

    if (!fs.existsSync(filePath)) {
      fs.mkdir(filePath, err => {
        if (err) {
          console.log(err)
        } else {
          cb(null, filePath)
        }
      })
    } else {
      cb(null, filePath)
    }
  },
  filename: function(req, file, cb) {
    var ext = path.extname(file.originalname)
    // UUID 处理
    function guid() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(
        c
      ) {
        var r = (Math.random() * 16) | 0,
          v = c == 'x' ? r : (r & 0x3) | 0x8
        return v.toString(16)
      })
    }

    cb(null, file.fieldname + guid() + Date.now() + ext)
  }
})

var upload = multer({ storage: storage })

//单文件上传
router.post('/upload1', upload.single('file'), function(req, res, next) {
  const date = new Date();
  const toPad2 = num => num.padStart(2, '0');
  const imgDir = `${date.getFullYear()}${toPad2(`${date.getMonth() + 1}`)}${toPad2(
      `${date.getDate()}`)}_images/`;
  res.json({
    code: 200,
    filePath:
      'http://' +
      req.headers.host +
      '/uploadimg/' + imgDir +
      path.basename(req.file.path)
  })
})

//多文件上传
router.post("/upload2",upload.array("file",20),function(req,res,next){	
  const date = new Date();
  const toPad2 = num => num.padStart(2, '0');
  const imgDir = `${date.getFullYear()}${toPad2(`${date.getMonth() + 1}`)}${toPad2(
      `${date.getDate()}`)}_images/`;
  var filePath=[];
	for(var i=0; i<req.files.length;i++){
   	var tmpPath = 'http://' +
     req.headers.host +
     '/uploadimg/' + imgDir +
     path.basename(req.files[i].path);
     filePath.push(tmpPath);
  }
	res.json({
		code:200,
		filePath:filePath
  })
  // var arr = [];
	// for(var i in req.files){
		
	// 	arr.push(req.files[i].path);
	// }
	// res.json({
	// 	code:200,
	// 	data:arr
	// })

})

//提交
router.post('/submmit', function(req, res) {
  console.log(req)
  var data={
    "similarList":[
      {
        "cutImgPath":"img/1.jpg",
        "picName":"ddd",
        "segNum":"",
        "similarValue":"80%"
      },
      {
        "cutImgPath":"img/2.jpg",
        "picName":"ddd",
        "segNum":"",
        "similarValue":"60%"
      }
    ]
  }
  res.json({ code: 200, data: data })
})

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: '上传' })
})
//获取配置文件
router.get('/config', function(req, res, next) {
  res.json({ types: types })
})

module.exports = router
