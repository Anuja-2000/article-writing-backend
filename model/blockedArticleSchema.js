const mongoose = require('mongoose');
const blockedArticleSchema = new mongoose.Schema({
    blockedAId:{type: String, unique: true},
    readerId:{type: String, require: true},
    readerName:{type: String, require: true},
    blockedReason:{type: String, require: true},
    time:{type: Date, require: true,default: Date.now},
    articleId:{type: String, require: true},
    writerId:{type: String, require: true},
},{ collection: 'BlockedArticles' });

blockedArticleSchema.index({ articleId: 1, readerId: 1 }, { unique: true });
module.exports = mongoose.model('BlockedArticle', blockedArticleSchema);