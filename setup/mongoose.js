const GridFsStorage = require('multer-gridfs-storage')
const mongoose = require('mongoose');
var Grid = require('gridfs-stream');

// Connection to the database 
mongoose.connect('mongodb://localhost/my_database', {useFindAndModify:false});
var conn = mongoose.connection
Grid.mongo = mongoose.mongo

var gfs = null
const secret = 'secret'
conn.once('open', function(){
    console.log('connection opened')
    gfs = Grid(conn.db, mongoose.mongo)
    gfs.collection('uploads')
    
})

const storage = new GridFsStorage({
    db: conn,
    file: (req,file) => {
      var hash = crypto.createHmac('sha256', secret)
                        .update(file.originalname + 'Lincoln Mcloud') //make sure your put the user from session
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

module.export = storage, secret;