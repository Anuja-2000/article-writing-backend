const mongoose = require('mongoose');
const ReaderArticleSchema = new mongoose.Schema({
   id:{type: String, unique: true},
   title:{type: String, require: true},
   content:{type: String, require: true},
   image:{type: String, require: true},
   profilePic:{type: String, require: true},
   writer:{type: String, require: true},
   userId:{type: String, require: true},
   date:{type: Date, require: true,default: Date.now()},
   time:{type: String, require: true},
   likes:{type: Number, require: true},
   tags:{type: [String], require: true}
},{ collection: 'articleData' });

ReaderArticleSchema.virtual('formattedDateTime').get(function () {
   const formattedDate = this.date.toISOString().split('T')[1];
   return `${formattedDate} ${this.time}`;
});

module.exports = mongoose.model('articleData', ReaderArticleSchema);

