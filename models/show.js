var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var objectId = Schema.Types.ObjectId

var showSchema = new Schema({
    owner: {type:String}, //Make this required in the future
    name: {type:String}, //Maske this required in the future
    seasons: {type:Array}
});


module.exports = mongoose.model('Show', showSchema);