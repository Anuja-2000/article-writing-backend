const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true },
    email: { type: String, required: true },
    name: { type: String, required: true },
    displayName: { type: String, required: true },
    type: { type: String, required: true },
    password: { type: String, required: true },
    savedAt: { type: Date, default: Date.now() },
    isActive: { type: Boolean, default: true },
    imgUrl: { type: String, default: "" },
    isDeactived: {type:Boolean, default:false} 
}, { collection: 'userData' });

userSchema.index({ userId: 1 }, { unique: true });

module.exports = mongoose.model('User', userSchema);
