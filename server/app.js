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
  News = require('./models/news.js'),
  Announcement = require('./models/announcement.js'),
  Message = require('./models/message.js');

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

app.get('/apis/getUserProfile', (req, res, next) => {
  User.getProfile(req.query.username).then(data => {
    res.json(data)
  }).catch(err => {
    console.log(err)
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

// 用户修改头像
app.post('/apis/updateUserProfile', (req, res, next) => {
  User.updateProfile({
    username: req.body.username,
    userProfile: req.body.srcStr
  }).then(data => {
    console.log(data)
    res.send({status: 'success'})
  }).catch(err => {
    res.send({status: 'fail'})
  })
})

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
        // console.log(data)
        for(let i in data) {
          allServiceScore += data[i].comment_service_score;
          allEnvironmentalScore += data[i].comment_environmental_score
        }

        // console.log('******************');
        // console.log('allServiceScore: ' + allServiceScore);
        // console.log('allEnvironmentalScore' + allEnvironmentalScore);
        // console.log('******************');

        Canteen_Comments.fetchAllCount(req.body.comment_belongsTo).then(data => {
          canteenCommentsCount = data * 1;

          newServiceScore = ((allServiceScore * 1) / canteenCommentsCount).toFixed(1);
          newEnvironmentalScore = ((allEnvironmentalScore) / canteenCommentsCount).toFixed(1);
          newOverAllScore = (((newServiceScore * 1) + (newEnvironmentalScore * 1)) / 2).toFixed(1);

          // console.log('******************');
          // console.log('newServiceScore: ' + newServiceScore);
          // console.log('newEnvironmentalScore' + newEnvironmentalScore);
          // console.log('newOverAllScore: ' + newOverAllScore)
          // console.log('******************');

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
  let p = new Promise((resolve, reject) => {
    News.findByTime('news').then(news => {
      resolve(news)  
    })  
  })

  p.then(news => {
    News.findByTime('hotNews').then(hotNews => {
      res.send({
        news: news,
        hotNews: hotNews
      })
    })  
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

// 查找公告
app.get('/apis/getAnnouncements', (req, res, next) => {
  Announcement.getAnnouncements({
    count: req.query.count,
    page: req.query.page
  }).then(data => {
    res.json(data);
  }).catch(err => {
    console.log(err)
  })
})

// 查看一个公告
app.get('/apis/getOntAnnouncement', (req, res, next) => {
  Announcement.findById(req.query.id).then(data =>{
    res.json(data)
  }).catch(err => {
    console.log(err)
  })
})

// 获取留言
app.get('/apis/getMsg', function(req, res, next) {
  Message.fetchAllLength().then(length => {
    console.log(Math.ceil(length / req.query.itemShow));
    Message.fetchMsg({
      page: req.query.page,
      itemShow: req.query.itemShow
    }).then(data => {
      if (data.length > 0) {
        res.send({
          status: 'success',
          msg: data,
          allPages: Math.ceil(length / req.query.itemShow)
        })
      } else {
        res.send({
          status: 'success',
          msg: [],
          allPages: 0
        })
      }
    }).catch(err => {
      console.log(err);
      res.send({
        status: 'fail'
      })
    })

  })
})

// 留言
app.post('/apis/leaveMsg', function(req, res, next) {
  let newMsg = new Message({
    msg_by: req.body.msg_by,
    msg_content: req.body.msg_content,
    msg_date: Date.parse(new Date())
  })
  newMsg.save()
    .then(data => {
      if (data._id) {
        res.send({
          status: 'success'
        })
      } else {
        res.send({
          status: 'fail'
        })
      }
    }).catch(err => {
      console.log(err);
      res.send({
        status: 'fail'
      })
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

// 删除用户
app.post('/apis/admin/deleteUser', (req, res, next) => {
  User.deleteUser(req.body.id).then(data => {
    console.log(data);
    res.send({status: 'success'})
  }).catch(err => {
    res.send({status: 'fail'})
  })
})

// 获取食堂所有信息
app.get('/apis/admin/getCanteen', function(req, res, next) {
  Canteen.find().then(data=> {
    console.log(data)
    res.json(data)
  }).catch(er => {
    console.log(err);
  })
})

// 获取食堂照片
app.get('/apis/admin/getCanteenImgs', (req, res, next) => {
  Canteen.getCanteenImgs(req.query.canteen_id).then(data => {
    console.log(data);
    res.json(data)
  }).catch(err => {
    console.log(err)
  })
})

// 更新食堂照片
app.post('/apis/admin/updateCanteenImgs', (req, res, next) => {
  Canteen.updateCanteenImgs({
    canteen_id: req.body.canteen_id,
    canteen_imgs: req.body.canteen_imgs
  }).then(data => {
    console.log(data)
    if (data.n == 1 && data.ok == 1)
    res.send({status: 'success'})
  }).catch(err => {
    console.log(err)
    res.send({status: 'fail'})
  })
})

// 删除食堂评论
app.post('/apis/admin/delCanteenComment', (req, res, next) => {
  Canteen_Comments.delOne(req.body.comment_id).then(data => {
    if (data.n == 1 && data.ok == 1) {
      res.send({status: 'success'})
    }
  }).catch(err => {
    console.log(err);
    res.send({status: 'fail'})
  })
})

// 获取食堂所属菜品的数量
app.get('/apis/admin/getFoodCount', (req, res, next) => {
  Food.getFoodCount(req.query.canteen_id).then(data => {
    res.send({
      status: 'success',
      count: data
    })
  }).catch(err => {
    console.log(err)
    res.send({status: 'fail'})
  })
})

// 删除菜品
app.post('/apis/admin/delOneFood', (req, res, next) => {
  Food.delOne(req.body.food_id).then(data => {
    console.log(data)
    if (data.n == 1 && data.ok ==1) {
      res.send({status: 'success'})
    } else {
      res.send({status: 'fail'})
    }
  }).catch(err => {
    console.log(err)
  })
})

// 添加菜品
app.post('/apis/admin/addNewFood', (req, res, next) => {
  let body = req.body;
  let newFood = new Food({
    food_name: body.food_name,
    food_brief: body.food_brief,
    food_price: body.food_price,
    food_tel: body.food_tel,
    open_time: body.open_time,
    food_addr: body.food_addr,
    food_belongsTo: body.food_belongsTo,
    food_cover_img: body.food_cover_img == undefined ? '' : body.food_cover_img
  })

  newFood.save().then(data => {
    console.log(data)
    res.send({status: 'success'})
  }).catch(err => {
    console.log(err)
    res.send({status: 'fail'})
  })
})

// 修改菜品信息
app.post('/apis/admin/changeFoodInfo', (req, res, next) => {
  let body = req.body;
  Food.changeFoodInfo({
    food_id: body.food_id,
    food_name: body.food_name,
    food_brief: body.food_brief,
    food_price: body.food_price,
    food_tel: body.food_tel,
    open_time: body.open_time,
    food_addr: body.food_addr,
    food_cover_img: body.food_cover_img
  }).then(data => {
    console.log(data)
    res.send({status: 'success'})
  }).catch(err => {
    console.log(err)
  })
})

// 删除公告
app.post('/apis/admin/delAnnouncement', (req, res, next) =>{
  Announcement.delOne(req.body.id).then(data => {
    if (data.n == 1 && data.ok == 1) {
      res.send({status: 'success'})
    }
  }).catch(err => {
    res.send({status: 'fail'})
    console.log(err)
  })
})

// 发表新公告
app.post('/apis/admin/publishAnnouncement', (req, res, next) => {
  let body = req.body;
  let newAnnouncement = new Announcement({
    announcement_title: body.title,
    announcement_content: body.content
  });

  newAnnouncement.save().then(data => {
    console.log(data)
    res.send({status: 'success'})
  }).catch(err => {
    res.send({status: 'fail'})
  })
})

// 查找公告数量
app.get('/apis/admin/getNewsCount', (req, res, next) => {
  News.findCount().then(data => {
    res.send({
      status: 'success',
      count: data
    })
  })
})

// 查找公告
app.get('/apis/admin/getNews', (req, res, next) => {
  News.findByPage(req.query.page)
  .then(data => {
    res.json(data)
  })
})

// 删除公告
app.post('/apis/admin/delOneNews', (req, res, next) => {
  News.delOne(req.body.id).then(data => {
    console.log(data)
    if (data.n == 1 && data.ok == 1) {
      res.send({status: 'success'})
    } else {
      res.send({status: 'fail'})
    }
  })
})

// 添加新闻
app.post('/apis/admin/publishNews', (req, res, next) => {
  let body = req.body;
  let newNews = new News({
    news_title: body.news_title,
    news_text: body.news_text,
    news_category: body.news_category
  });

  newNews.save().then(data => {
    res.send({status: 'success'})
  }).catch(err => {
    res.send({status: 'fail'})
  })
})

// 更新新闻pv
app.post('/apis/admin/updateNewsPv', (req, res, next) => {
  News.updatePv(req.body.id).then(data => {
    res.send({status: 'success'})
  }).catch(err => {
    res.send({status: 'fail'})
  })
})

// 留言状态操作，hasRead已读 / notRead未读
app.post('/apis/admin/operateMsgStatus', function(req, res, next) {
  Message.operateMsgStatus(req.body.msgArr)
    .then(data => {
      // console.log(Array.from(JSON.parse(req.body.msgArr)).length)
      if (data.n > 0 && data.ok == 1) {
        res.send({
          status: 'success'
        })
      } else {
        res.send({
          status: 'fail'
        })
      }
    }).catch(err => {
      console.log(err)
      res.send({
        status: 'fail'
      })
    })
})

// 删除留言
app.post('/apis/admin/delMsg', function(req, res, next) {
  Message.delMsg(req.body.msgArr)
    .then(data => {
      console.log(data)
      if (data.n == 1 && data.ok == 1) {
        res.send({
          status: 'success'
        })
      } else {
        res.send({
          status: 'fail'
        })
      }
      
    }).catch(err => {
      console.log(err);
      res.send({
          status: 'fail'
        })
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