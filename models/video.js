var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var objectId = Schema.Types.ObjectId
var Int = Schema.Types.Number
//var int = Schema.Types.int

var videoSchema = new Schema({
    owner: {type: String, required: true},
    videoPath: {type: String, required: true},
    //videoLength: {type: String, required: true},
    episodeName: {type:String, required:true},
    showId: {type:objectId, required:true},
    seasonId: {type:objectId, required:true},
    order: {type:Int, required:true}
    //Add the show that owns the episode
});


module.exports = mongoose.model('Video', videoSchema); 