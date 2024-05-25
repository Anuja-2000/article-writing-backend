const mongoose = require('mongoose');
const LikeSchema = new mongoose.Schema({
   id:{type: String, unique: true},
   readerId:{type: String, require: true},
   articleId:{type: String, require: true},
   date:{type: Date, require: true,default: Date.now()},
},{ collection: 'likes' });

module.exports = mongoose.model('Likes', LikeSchema);

