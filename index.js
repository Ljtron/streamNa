// Imports for the software
const express = require('express')
const fs = require('fs')
const path = require('path');
const mongoose = require('mongoose');
const multer = require('multer')
const GridFsStorage = require('multer-gridfs-storage')
var Grid = require('gridfs-stream');
var session = require('express-session');
const video = require('./models/video');
const crypto = require('crypto');
const show = require('./models/show');
const bodyParser = require('body-parser');
const season = require('./models/season');
const hbs = require('express-hbs');
const apis = require('./routes/api')
const createroute = require('./routes/create')
const watchroute = require('./routes/watch')
const createrdashboard = require("./routes/createrDashboard")

// Express caller
const app = express()

// Express middleware
app.engine('hbs', hbs.express4({
  partialsDir: __dirname + '/views/partials'
}));
app.set('view engine', 'hbs');
app.use(session({secret: 'mysupersecret', resave: false, saveUninitialized: false}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Connection to the database 
mongoose.connect('mongodb://localhost/my_database', {useFindAndModify:false});
var conn = mongoose.connection
Grid.mongo = mongoose.mongo

var gfs = null
var user = "Lincoln Mcloud"
const secret = Math.random()

// Grid connection to database once the connection is of the database is settled
conn.once('open', function(){
  console.log('connection opened')
  gfs = Grid(conn.db, mongoose.mongo)
  gfs.collection('uploads')
  
})

//const mongoosesetup = require('./setup/mongoose')
//
const storage = new GridFsStorage({
  db: conn,
  file: (req,file) => {
    var hash = crypto.createHmac('sha256', secret.toString())
                      .update(file.originalname + req.session.user) //make sure your put the user from session
                      .digest('hex')
    //var filename = file.originalname + user

    return fileinfo ={
      filename: hash,
      bucketName: 'uploads'
    }
    /*return new Promise((resolve, reject) =>{
      const filename = file.originalname
      const fileinfo ={
        filename: 
        bucketName: 'uploads'
      }

      var newVideo = new video();
      newVideo.user = req.session['user']
   
      resolve(fileinfo)
    })*/
  }
})

// middleware routes
app.use('/api', apis)
app.use('/create', createroute)
app.use('/watch', watchroute)
app.use('/dashboard', createrdashboard)

app.get('/', function(req, res) {
  req.session.user = "Lincoln Mcloud"
  //req.session.watching = true;
  res.render('index',{
    title: 'streanna',
    search_bar: true
  })
  //res.sendFile(path.join(__dirname + '/index.html'))
})


app.get('/upload/season/:showID', function(req, res){
  //console.log(req.params.showID)
  //var parm = req.params.showID
  show.findOne({_id: req.params.showID}, function(err,doc){
    if(err){
      console.log(err)
      res.redirect('/')
    }
    else if(!doc){
      console.log('nothing here')
      res.redirect('/')
    }
    else{
      res.render('upload', {
        title:'upload',
        search_bar: true,
        path: '/upload' + '/'+ req.params.showID
      })
    }
  })
  //res.sendFile(path.join(__dirname + '/upload.html'))
})

// This route is used for uploading the videos and images for the season
const upload = multer({storage:storage})
var cpUpload = upload.fields([{name:'avatar', maxCount:25} ])
app.post('/upload/:showID', cpUpload, function(req,res){
  var lengthVideos = req.files['avatar'].length
  //var seasonName = 'The show'
  //let seasonId;
  //var shows = []
  show.findOne({_id: req.params.showID}, function(err,doc){
    if(err){
      console.log(err)
      res.redirect('/')
    }
    else if(!doc){
      console.log('nothing here')
      res.redirect('/')
    }
    else{
      // This section creates the season for the show
      season.find({'showId': {$all: [req.params.showID]}}, function(err,docs){
        if(err){
          res.redirect('/')
        }
        else if(!docs){
          var newSeason = new season();
  newSeason.name = 'season 1';
  newSeason.owner = user; 
  newSeason.showId = doc._id
  newSeason.save(function(err, result){
    if(err){
      console.log(err)
      res.redirect('/')
    }
    else{
      seasonID = result._id;
      var ord = 0
      for(i=0; i<lengthVideos; i++){
        //console.log(req.files['avatar'][i])
        
        var newVideo = new video();
        newVideo.owner = user
        var hash = crypto.createHmac('sha256', secret.toString())
                          .update(req.files['avatar'][i].originalname + req.session.user)
                          .digest('hex')
        newVideo.videoPath = hash;
        //newVideo.videoLength = req.files['avater'][i]['length']
        var name = 'name' + i.toString()
        //console.log(req.body[name])
        newVideo.episodeName = req.body[name]
        newVideo.seasonId = seasonID
        newVideo.showId = doc._id
        newVideo.order = ord
        ord += 1;
        newVideo.save(function(err, result){ 
          if(err){
            console.log(err)
          }
    
          if(result){
            console.log('something is there')
          }
          else{
            console.log('There was an error as expected')
          }
        })
      }
      
      res.redirect('/')
    }
  })
        }
        else{
          var newSeason = new season();
          
          newSeason.name = 'season ' + (parseInt(docs.length) + 1);
          newSeason.owner = user; 
          newSeason.showId = doc._id
          //newSeason.order = docs.length + 1
          newSeason.save(function(err, result){
            if(err){
              console.log(err)
              res.redirect('/')
            }
            else{
              seasonID = result._id;
              var ord = 0
              for(i=0; i<lengthVideos; i++){
                //console.log(req.files['avatar'][i])
                
                var newVideo = new video();
                newVideo.owner = user
                var hash = crypto.createHmac('sha256', secret.toString())
                                  .update(req.files['avatar'][i].originalname + req.session.user)
                                  .digest('hex')
                newVideo.videoPath = hash;
                //newVideo.videoLength = req.files['avater'][i]['length']
                var name = 'name' + i.toString()
                //console.log(req.body[name])
                newVideo.episodeName = req.body[name]
                newVideo.seasonId = seasonID
                newVideo.showId = doc._id
                newVideo.order = ord
                ord += 1;
                newVideo.save(function(err, result){ 
                  if(err){
                    console.log(err)
                  }
            
                  if(result){
                    console.log('something is there')
                  }
                  else{
                    console.log('There was an error as expected')
                  }
                })
              }
              
              res.redirect('/')
            }
          })
        }
      })
  
  
    }
  })


  
})

//put params in the route to represnt the user like (/create/usId/show)
/*app.get('/create/show', function(req,res){
  res.sendFile(path.join(__dirname + '/createShow.html'))
})

app.post('/create/show', function(req,res){
  var newShow = new show();
  newShow.name = req.body.showName
  newShow.owner = 'Lincoln Mcloud'

  newShow.save()

  res.redirect('/')
})*/

app.get('/stream/:name', function(req, res) {
  //setInterval(function())
  //console.log(watching)
  //console.log(req.session.user)
  //console.log(req.session.watching + ': from stream')
  //console.log(req.headers)
  if(req.headers.referer){
    //console.log('There is a referer')
    /*var readStream = gfs.createReadStream({
      _id: "5d815c1357c73a398c2df129",
      //range:{startPos: start,endPos: file.length}
      })
    readStream.pipe(res);*/
    gfs.files.findOne({ filename: req.params.name}, (err, file) =>{
      //console.log(file)
      var parts = req.headers['range'].replace(/bytes=/, '').split('-')
      var partialStart = parts[0]
      var partialend = parts[1]
      var start = parseInt(partialStart, 10)
      var end = partialend ? parseInt(partialend, 10) : file.length - 1;
      var chunkSize = end - start + 1
      res.writeHead(206,{
        'Accept-Ranges': 'bytes',
        'Content-Length': chunkSize,
        'Content-Range': 'bytes ' + start + '-' + end + '/' + file.length,
        "Content-Type": "video/mp4"});
      var readStream = gfs.createReadStream({
        _id: file._id,//"5d815c1357c73a398c2df129",
        range:{
          startPos: start,
          endPos: file.length
        }
      })
      readStream.on('error', function (err) {
        console.log('An error occurred!', err);
        //throw err;
        res.send("nothing here")
      });
      readStream.pipe(res);
    })
  }
  else{
    res.send('invalid')
  }
  
})

app.listen(3000, function () {
  console.log('Listening on port 3000!')
})