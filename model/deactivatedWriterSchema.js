const mongoose = require('mongoose');
const deactivatedWriterSchema = new mongoose.Schema({
    deactivatedId: { type: String, unique: true, required: true },
    deactivatedReason: { type: String},
    writerId: { type: String, required: true },
    deactivatedBy: { type: String, required: true },
    deactivatedAt: { type: Date, default: Date.now},
}, { collection: 'deactivatedWriters' });


module.exports = mongoose.model('DeactivatedWriter', deactivatedWriterSchema);