const mongoose = require('mongoose');
const ApprovalSchema = new mongoose.Schema({
    approvalId:{type: String, unique: true},
    adminId:{type: String, require: true},
    articleId:{type: String, require: true},
    status:{type: String, require: true},
    approvedAt:{type: Date, require: true,default: Date.now},
},{ collection: 'articleApprovedBy' });

//ApprovalSchema.index({ adminId: 1, articleId: 1 }, { unique: true });

// Add a virtual property for the formatted time


module.exports = mongoose.model('Approval', ApprovalSchema);

