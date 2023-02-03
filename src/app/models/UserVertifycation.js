const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserVertifycationSchema = new Schema({
    userId: String,
    uniqueString: String,
    createAt: Date,
    expiresAt: Date,
})

const UserVertifycation = mongoose.model('UserVertification', UserVertifycationSchema);
module.exports = UserVertifycation;