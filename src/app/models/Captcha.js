const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CaptchaSchema = new Schema({
    captcha: String,
    createAt: Date,
    expiresAt: Date,
})

const Captcha = mongoose.model('Captcha', CaptchaSchema);
module.exports = Captcha;