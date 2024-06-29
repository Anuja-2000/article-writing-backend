const mongoose = require('mongoose');
const ViewSchema = new mongoose.Schema({
   id:{type: String, unique: true},
   readerId:{type: String, require: true},
   articleId:{type: String, require: true},
   date:{type: Date, require: true,default: Date.now()},
},{ collection: 'views' });

module.exports = mongoose.model('Views', ViewSchema);

