var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var objectId = Schema.Types.ObjectId
var Int = Schema.Types.Number

var seasonSchema = new Schema({
    owner: {type:String, required:true},
    name: {type:String, required:true},
    episodes: {type:Array},
    showId: {type:objectId, required:true},
    //order: {type:Int, required:true}
});


module.exports = mongoose.model('Season', seasonSchema);