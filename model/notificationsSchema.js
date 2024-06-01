const mongoose = require('mongoose');

const notificationsSchema = new mongoose.Schema({
    notificationId: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: { type: String, required: true },
    savedAt: { type: Date, default: Date.now() },
    markedAsRead: { type: Boolean, default: false },
}, { collection: 'notifications' });

notificationsSchema.index({ notificationId: 1 }, { unique: true });

module.exports = mongoose.model('Notifications', notificationsSchema);
