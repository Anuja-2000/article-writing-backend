const mongoose = require('mongoose');
const ReaderArticleSchema = new mongoose.Schema({
   articleId:{type: String,unique: true,required: true,},
   title:{type: String, require: true},
   content:{type: String, require: true},
   coverImage:{type: String, require: true},
   userId:{type: String, require: true},
   updatedAt:{type: Date, require: true},
   likes:{type: Number, require: true},
   tags:{type: [String], require: true},
   viewCount:{type: Number, require: true},
   domain:{type: String,default: ""},
   status: {type: String,default: "pending",} // pending, approved, rejected
},{ collection: 'articles' });

module.exports = mongoose.model('articleData', ReaderArticleSchema);

