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
   view:{type: Number, require: true},
},{ collection: 'articles' });

ReaderArticleSchema.virtual('formattedDateTime').get(function () {
   const formattedDate = this.date.toISOString().split('T')[1];
   return `${formattedDate} ${this.time}`;
});

module.exports = mongoose.model('articleData', ReaderArticleSchema);

