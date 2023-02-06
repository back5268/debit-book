const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserVertificationSchema = new Schema({
    userId: String,
    uniqueString: String,
    createAt: Date,
    expiresAt: Date,
})

const UserVertification = mongoose.model('UserVertification', UserVertificationSchema);
module.exports = UserVertification;