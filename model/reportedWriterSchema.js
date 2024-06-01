const mongoose = require('mongoose');

const reportedWriterSchema = new mongoose.Schema({
    reportId: { type: String, unique: true },
    reporterName: { type: String, required: true },
    reportedReason: { type: String, required: true },
    time: { type: Date, required: true, default: Date.now },
    writerId: { type: String, required: true },
    isDeactivated: { type: Boolean, default: false },
    deactivatedBy: { type: String },
    deactivatedAt: { type: Date }
}, { collection: 'reportedWriters' });

module.exports = mongoose.model('ReportedWriter', reportedWriterSchema);