const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EventSchema = new Schema({
    createBy: String,
    title: String,
    time: Date,
    date: String,
    noticeTime: Date,
    description: String,
    createAt: { type: Date, default: Date.now },
})

const Event = mongoose.model('Event', EventSchema);
module.exports = Event;