const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  fullname: String,
  email: String,
  account: String,
  password: String,
  verified: Boolean,
  phone: String,
  address: String,
  description: String,
  role: Number,
  createAt: Date,
  lastLogin: Date,
});

const User = mongoose.model('User', UserSchema);
module.exports = User;