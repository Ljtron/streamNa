var express = require('express');
const video = require("../models/video")
const season = require("../models/season")
const show = require("../models/show")

var route = express.Router();

//This route is used for showing the main screen of the video that will be played
//make sure you change static variables in the entire program like the one in show.findOne
route.get('/:showId', function(req, res){
    show.findOne({_id: req.params.showId}, function(err, result){
      if(err){
        console.log(err + ' :error')
        res.status(404)
      }
  
      else if(!result){
        console.log('Nothing in show')
        res.status(404)
      }
  
      else{
        season.find({'showId': {$all: [req.params.showId]}}, function(err, docs){
          if(err){
            console.log(err)
            res.redirect('/')
          }
          else if(!docs){
            console.log('no seasons with this id')
            res.status(404)
          }
          else{
            var id = docs[parseInt(req.query.ss)]
            video.find({'seasonId': {$all: [id]}}, function(err, videoDocs){

              /*var productchuck = [];
              var chunksize = 3;
              for(var i=0; i<info.length; i++){
                var sp = req.params.userid.split(" ")
                //console.log(sp)
                //info[i].createUrl = '/upload/season/' + req.params.showid
                info[i].url = '/dashboard/video/' + sp[0] + '%20'+ sp[1] + '/' + info[i]._id
              }
              for (var i=0; i<info.length; i += chunksize){
                productchuck.push(info.slice(i, i+chunksize));
              }*/
              var videoId = videoDocs[parseInt(req.query.epi)]
              var path = "http://localhost:3000/stream/" + videoId.videoPath 
              res.render('stream', {
                src: path,
                //klak: req.session.user,
                //title: epi.episodeName,
                search_bar: true,
                showslist: null //listobjects
                //length: epi['length']
              })
            })

          }
        })
        /*var id = result.seasons[parseInt(req.query.ss)]
        console.log(id)
        var listobjects = [];
        let path;
        let name;
        season.findOne({_id: id}, async function(err, show){
          if(err){
            console.log(err)
          }
  
          else if(!show){
            console.log('nothing in season');
            res.redirect('/')
          }
  
          else{
          console.log(show)
          //var showslist = show.episodes
          //var videolist = videoslide(showslist)
          //video.find({''})
          for(i=0; i<show.episodes.length; i++){
            await video.findOne({_id: show.episodes[i]}, function(err, result){
              if(i == parseInt(req.query.epi)){
                console.log('found')
                path = result.videoPath
                name = result.episodeName
                objectJson = {
                  name: name,
                  //imgPath: null
                }
  
                listobjects.push(objectJson)
              }
              else{
                objectJson = {
                  name: result.episodeName,
                  //imgPath: null
              }
  
              listobjects.push(objectJson)
              }
            })
          }
          console.log(listobjects)
          var showid = "http://localhost:3000/stream/" + path
          console.log(showid)
          //console.log(showslist)
          res.render('stream', {
            src: showid,
            //klak: req.session.user,
            //title: epi.episodeName,
            search_bar: true,
            showslist: listobjects
            //length: epi['length']
          })
          }
        })*/
      }
    })
  })

route.get('/list/:id', function(req, res){
  season.find({'showId': {$all: [req.params.id]}}, function(err, docs){
    console.log(docs)
    res.json(docs)
  })
})
module.exports = route;