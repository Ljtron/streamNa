var express = require('express');
const video = require("../models/video")
const season = require("../models/season")
const show = require("../models/show")
//const mongoose = require('../setup/mongoose');

var route = express.Router();

async function showFunc(id){

}

// The param should user the id provided from mongodb
// change user to user id
route.get('/:userid', function(req, res){
    show.find({'owner': {$all: [req.params.userid]}}, function(err, info){
      if(err){
        console.log('There was an error')
        console.log(err)
        res.redirect('/')
      }
      else if(!info){
        //res.redirect('/') 
        res.render('dashboard',{
          title: 'Dashboard',
          err: 'There are no shows here',
          //show:productchuck,
          search_bar: true,
          //length: info.length
        })
      }
      else{
        //console.log(info)
        var productchuck = [];
        var chunksize = 3;
        for(var i=0; i<info.length; i++){
          var sp = req.params.userid.split(" ")
          //console.log(sp)
          //info[i].createUrl = '/create/show'
          info[i].url = '/dashboard/season/' + sp[0] + '%20'+ sp[1] + '/' + info[i]._id //put req.session['passport'].userId
        }
        for (var i=0; i<info.length; i += chunksize){
          productchuck.push(info.slice(i, i+chunksize));
        }
        res.render('dashboard',{
          title: 'Dashboard',
          show:productchuck,
          search_bar: true,
          //length: info.length
        })
        //res.send("There is information: \n" + info)
        //res.redirect('/')
      }
    })
  })

route.get('/video/:userid/:seasonid', function(req, res){
  video.find({'seasonId': {$all: [req.params.seasonid]}}, function(err, info){
    if(err){
      console.log('There was an error')
      console.log(err)
      res.redirect('/')
    }
    else{
      //console.log(info)
      var productchuck = [];
      var chunksize = 3;
      for (var i=0; i<info.length; i += chunksize){
        productchuck.push(info.slice(i, i+chunksize));
      }
      res.render('dashboard',{
        title: 'Dashboard',
        video:productchuck,
        search_bar: true,
        length: info.length
      })
      //res.send("There is information: \n" + info)
      //res.redirect('/')
    }
  })
})

route.get('/season/:userid/:showid', function(req, res){
  season.find({'showId': {$all: [req.params.showid]}}, function(err, info){
    if(err){
      console.log('There was an error')
      console.log(err)
      res.redirect('/')
    }
    else if(!info){
      res.redirect('/dashboard/show/' + req.params.userid)
    }
    else{
      //console.log(info)
      var productchuck = [];
      var chunksize = 3;
      for(var i=0; i<info.length; i++){
        var sp = req.params.userid.split(" ")
        //console.log(sp)
        //info[i].createUrl = '/upload/season/' + req.params.showid
        info[i].url = '/dashboard/video/' + sp[0] + '%20'+ sp[1] + '/' + info[i]._id
      }
      for (var i=0; i<info.length; i += chunksize){
        productchuck.push(info.slice(i, i+chunksize));
      }
      res.render('dashboard',{
        title: 'Dashboard',
        season:productchuck,
        seasonLink: '/upload/season/' + req.params.showid,
        search_bar: true,
        length: info.length
      })
      //res.send("There is information: \n" + info)
      //res.redirect('/')
    }
  })
})
module.exports = route;