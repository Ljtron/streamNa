//imports
var express = require('express');
const video = require("../models/video")
const season = require("../models/season")
const show = require("../models/show")
//const mongoose = require('../setup/mongoose');

var route = express.Router();


//put params in the route to represnt the user like (/create/usId/show)
route.get('/show', function(req,res){
    res.render('createShow', {
        title:'create show',
        search_bar: true 
    })
    //res.sendFile(path.join(__dirname + '/createShow.html'))
})
  
route.post('/show', function(req,res){
    var newShow = new show();
    newShow.name = req.body.showName
    newShow.owner = 'Lincoln Mcloud'

    newShow.save(function(err,doc){
        if(err){
            res.redirect('/')
        }
        else if(! doc){
            res.redirect('/show')
        }
        else{
            var path = '/upload/season/' + doc._id
            res.redirect(path)
        }
    })
})

module.exports = route;