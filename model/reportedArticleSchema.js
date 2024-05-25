const mongoose = require('mongoose');
const reportedArticleSchema = new mongoose.Schema({
    reportId:{type: String, unique: true},
    reporterName:{type: String, require: true},
    reportedReason:{type: String, require: true},
    time:{type: Date, require: true,default: Date.now},
    articleId:{type: String, require: true},
    writerId:{type: String, require: true},
    status: { type: String, default: "approved" }
},{ collection: 'reportedArticles' });


module.exports = mongoose.model('ReportedArticle', reportedArticleSchema);