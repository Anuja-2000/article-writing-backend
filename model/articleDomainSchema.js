const mongoose = require('mongoose');
const ArticleDomainSchema = new mongoose.Schema({
    domainId:{type: String, unique: true},
    domainName:{type: String, require: true , unique: true},
    domainDescription:{type: String, require: true},
},{ collection: 'article_domains' });

ArticleDomainSchema.index({domainName:1},{unique:true});

module.exports = mongoose.model('ArticleDomain', ArticleDomainSchema);