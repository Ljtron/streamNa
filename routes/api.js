//Imports
var express = require('express');
const video = require("../models/video")
const season = require("../models/season")
const show = require("../models/show")

var route = express.Router();

// This route is used to spit out slides for each episode you look at
route.get('/slides/:showId/:seasonNum', function(req, res){
    console.log('slides sent')
    //res.json({hi:'hi'})
    show.findOne({_id: req.params.showId}), function(err, show){
        res.json('your being ')
        if(err){
            console.log(err);
            res.json({error: err})
        }
        else if(!show){
            console.log('nothing here')
            res.json({list: null})
        }
        else{
            res.json({hi: 'progress'})
            console.log('progress being made')
            var id = show.seasons[parseInt(req.params.seasonNum)]
            season.findOne({_id: id}, async function(err,doc){
                if(err){
                    console.log(err)
                    res.json({err: err})
                }
                else if(!doc){
                    console.log('nothing in seasons')
                    res.json({list: null})
                }
                else{
                    // Don't forget to return the image path
                    var listobjects = []
                    var listEpi = doc.episodes
                    for(i=0; i<listEpi.length; i++){
                        await video.findOne({_id: doc.episodes[i]}, function(err, result){
                            objectJson = {
                                name: result.episodeName,
                                imgPath: null
                            }
            
                            listobjects.push(objectJson)
                        })
                    }
                    res.json({
                        list: listobjects
                    })
                }
            })
        }
    }
})

route.get('/video/:videoId', function(req,res){
    video.findOne({_id: req.params.videoId}, function(err, doc){
        if(err){
            console.log(err)
        }

        else if(!doc){
            console.log("The document doesn't exist at api/video/:videoId")
            res.json({
                err: "The document doesn't exist at api/video/:videoId"
            })
        }

        else{
            res.json({
                videoRoute: doc.videoPath
            })
        }
    })
})

route.get('/show', function(req,res){
    var word = req.query.show
    show.find({
      name:{$regex: new RegExp(word)}}, {_id: 0,_v: 0}, function(err, data){
      res.json(data)
    }).limit(10)
  })

module.exports = route;