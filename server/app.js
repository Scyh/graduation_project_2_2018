var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var svgCaptcha = require('svg-captcha');
var fs = require('fs');

// 连接数据库
var mongoose = require('./db.js'),
  db = mongoose(),
  User = require('./models/user.js'),
  Food = require('./models/food.js'),
  Canteen = require('./models/canteen.js'),
  Canteen_Comments = require('./models/canteen_comments.js'),
  Food_Comments = require('./models/food_comments.js'),
  News = require('./models/news.js');

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.engine('.ejs', require('ejs').__express);
app.set('view engine', 'ejs');

//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false,
  limit: '10000kb'
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'uploadFile'))); //静态文件目录

// 解决跨域
app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By", ' 3.2.1')
  res.header("Content-Type", "application/json;charset=utf-8");
  next();
});

// 获取验证码
app.get('/apis/captcha', function(req, res, next) {
  var captcha = svgCaptcha.create();
  req.cookies.captcha = captcha.text;
  res.send({
    code: captcha.data.toString(),
    text: captcha.text.toString()
  })
});

// 用户注册
app.post('/apis/regUser', function(req, res, next) {
  let newUser = new User({
    username: req.body.username,
    password: req.body.password,
  })
  newUser.save(function(err, data) {
    if (err) {
      console.log(err)
    } else {
      res.send({
        status: 'success'
      })
    }
  });
})

// 检查用户名唯一
app.get('/apis/uniqueUserName', function(req, res, next) {
  User.uniqueUserName({
    username: req.query.username
  }, function(err, data) {
    if (err) {
      console.log(err)
    } else {
      if ((data * 1) > 0) {
        // 用户名存在
        res.send({
          status: 'fail',
        })
      } else {
        res.send({
          status: 'success'
        })
      }
    }
  })
})

// 验证用户接口
app.get('/apis/checkUser', function(req, res, next) {
  User.checkUser({
    username: req.query.username,
    password: req.query.password
  }).then(data => {
    console.log(data)
    if ((data.length * 1) > 0) {
      res.send({
        status: 'success',
        userData: data
      })
    } else {
      res.send({
        status: 'fail'
      })
    }
  }).catch(err => {
    console.log("err: " + err)
  })
});

// 获取 food 列表
app.get('/apis/getFoods', (req, res, next) => {
  Food.fetchPart({
    canteen: req.query.canteen,
    page: req.query.page
  }).then(data => {
    res.json(data)
  }).catch(err => {
    console.log(err)
  })
})

// 获取单个food的具体信息
app.get('/apis/getFoodDetail', (req, res, next) => {
  // console.log(req.query)
  Food.findById(req.query.food_id, (err, data) => {
    if (err) {
      console.log(err)  
    } else {
      res.json(data)  
    }
  })
})

// 获取食堂的信息
app.get('/apis/getCanteenDetail', (req, res, next) => {
  Canteen.findByCanteen_id(req.query.canteen_id)
        .then(data => {
          console.log(data)
          res.json(data)
        }).catch(err => {
          console.log(err)
        })
})

// 获取食堂评论
app.get('/apis/getSomeCanteenComments', (req, res, next) => {
  Canteen_Comments.findByCanteen_id({
      belongsTo: req.query.belongsTo,
      commentsCount: req.query.commentsCount,
      page: req.query.page
  }).then(data => {
      // console.log(data)
      res.json(data)
    }).catch(err => {
      console.log(err)
    })
})

// 添加食堂评论
app.post('/apis/addNewCanteenComment', (req, res, next) => {
  let newCanteenComment = new Canteen_Comments({
    comment_author: req.body.comment_author,
    comment_time: req.body.comment_time,
    comment_text: req.body.comment_text,
    comment_belongsTo: req.body.comment_belongsTo,
    comment_service_score: req.body.comment_service_score,
    comment_environmental_score: req.body.comment_environmental_score
  })

  newCanteenComment.save().then(data =>{
    // console.log(data)
    res.send({
      status: 'success'
    })
  }).catch(err => {
    res.send({
      status: 'fail'
    })
  }).then(() => {

    let allServiceScore = 0,
        allEnvironmentalScore = 0,
        newOverAllScore = 0,
        canteenCommentsCount = 0;
        console.log("*********::::" + req.body.comment_belongsTo)
    Canteen_Comments.fetchAllScore(req.body.comment_belongsTo)
      .then(data => {
        console.log(data)
        for(let i in data) {
          allServiceScore += data[i].comment_service_score;
          allEnvironmentalScore += data[i].comment_environmental_score
        }

        console.log('******************');
        console.log('allServiceScore: ' + allServiceScore);
        console.log('allEnvironmentalScore' + allEnvironmentalScore);
        console.log('******************');

        Canteen_Comments.fetchAllCount(req.body.comment_belongsTo).then(data => {
          canteenCommentsCount = data * 1;

          newServiceScore = ((allServiceScore * 1) / canteenCommentsCount).toFixed(1);
          newEnvironmentalScore = ((allEnvironmentalScore) / canteenCommentsCount).toFixed(1);
          newOverAllScore = ((newServiceScore * 1) + (newEnvironmentalScore * 1)) / 2;

          console.log('******************');
          console.log('newServiceScore: ' + newServiceScore);
          console.log('newEnvironmentalScore' + newEnvironmentalScore);
          console.log('newOverAllScore: ' + newOverAllScore)
          console.log('******************');

          Canteen.updateScore({
            canteen_id: req.body.comment_belongsTo,
            service_score: newServiceScore,
            environmental_score: newEnvironmentalScore,
            overall_score: newOverAllScore
          }).then(data => {
            console.log(data)
          }).catch(err => {
            console.log(err)
          })

        })

      })
  })
})

// 上传图片
app.post('/apis/uploadImg', (req, res, next) => {
  let imgArrObj = JSON.parse(req.body.imgArr);
  let imgArrURL = {};
  for(let i in imgArrObj) {
    let dataBuffer = new Buffer(imgArrObj[i].src, 'base64');
    let imgName = imgArrObj[i].name;
    // console.log(imgArrObj[i].name)
    fs.writeFile(__dirname + '/uploadFile/' + imgName, dataBuffer, err=> {
      if (err) {
        res.send({status: 'fail'})
      }
    })
    imgArrURL['img' + i] = 'http://localhost:3001/' + imgName;

  }

  res.send({
    status: 'success',
    imgsURL: JSON.stringify(imgArrURL)
  })
})

// 上传 food 评论
app.post('/apis/upLoadFoodComment', (req, res, next) => {
  
  // 新建评论
  let food_comment = new Food_Comments({
    f_comment_author: req.body.f_comment_author,
    f_commment_time: req.body.f_commment_time,
    f_comment_text: req.body.f_comment_text,
    f_comment_belongsTo: req.body.f_comment_belongsTo,
    f_score: req.body.f_score,
    f_upload_imgArr: req.body.f_upload_imgArr
  });

  // 保存
  food_comment.save().then(data => {
    res.send({
      status: 'success'
    })
  }).catch(err => {
    console.log("err: " + err);
    res.send({
      status: 'fail'
    })
  }).then(() => {

  /*
   *上传评论后还需更新下 food 的评分
   *先获取当前最新的评分、和评论总数,
   *除以 评论总数
   * Number.prototype.fixed(1)
   */
    var old_score = 0,
        new_score = 0,
        commentsCount = 0;
    
    // 获取添加评论之前 所有的评分
    Food_Comments.fetchAllScore(req.body.f_comment_belongsTo).then(data => {
        for(let i in data) {
          old_score += data[i].f_score;
        }
      
      // 获取所有的评论数
      Food_Comments.fetchCommentsCount(req.body.f_comment_belongsTo).then(data => {
        commentsCount = data;

        new_score = ((old_score * 1)  / (commentsCount * 1));
        console.log("**************")
        console.log("old_score: " + old_score);
        console.log("commentsCount: " + commentsCount)
        console.log("new_score: " + new_score )
        console.log("**************")
        Food.updataScore({
          food_id: req.body.f_comment_belongsTo,
          new_score: (new_score * 1).toFixed(1)
        }).then(data => {
          console.log(data)
        })

      })
      
    })

  })
})

// 加载 food_detail 页的评论
app.get('/apis/getFoodComments', (req, res, next) => {
  Food_Comments.fetchSomeFoodComments({
    food_id: req.query.food_id,
    page: req.query.page
  }).then(data => {
      // console.log(data)
      res.json(data)
    }).catch(err => {
      console.log(err)
    })
})

// food 评分排名
app.get('/apis/getFoodByStar', (req, res, next) => {
  Food.fetchByStar({
    ranking: req.query.ranking,
    page: req.query.rankingPage
  }).then(data => {
    // console.log(data)
    res.json(data)
  }).catch(err => {
    console.log(err)
  })
})

// 查找新闻
app.get('/apis/getLatestNews', (req, res, next) => {
  News.findByTime().then(data => {
    res.json(data)
  }).catch(err => {
    console.log(err)
  })
})

// 查找指定新闻
app.get('/apis/getOneNew', (req, res, next) => {
  News.findById(req.query.news_id).then(data => {
    res.json(data)
  }).catch(err => {
    console.log(err)
  })
})


/*
*管
*理
*员
*接
*口
*/

// 获取所以用户信息
app.get('/apis/admin/getUserInfo', function(req, res, next) {
  User.adminFetchSome(req.query.page)
    .then(users => {
      User.count({})
        .then(count => {
          res.send({
            count: count,
            users: users
          })
        })
    })
})

app.get('/apis/admin/getCanteen', function(req, res, next) {
  Canteen.find().then(data=> {
    console.log(data)
    res.json(data)
  }).catch(er => {
    console.log(err);
  })
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.listen(3001);
console.log('success listen…………');