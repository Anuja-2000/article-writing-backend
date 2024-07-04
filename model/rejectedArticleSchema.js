const mongoose = require('mongoose');
const rejectedArticleSchema = new mongoose.Schema({
    rejectedId: { type: String, unique: true, required: true },
    title: { type: String, unique: true, required: true },
    rejectedReason: { type: String},
    articleId: { type: String, required: true },
    writerId: { type: String, required: true },
    rejectedBy: { type: String, required: true },
    rejectedAt: { type: Date, default: Date.now},
}, { collection: 'rejectedArticles' });


module.exports = mongoose.model('RejectedArticle', rejectedArticleSchema);