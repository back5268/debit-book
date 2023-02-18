const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const slug = require('mongoose-slug-generator');
mongoose.plugin(slug);

const DebtorSchema = new Schema({
    UserId: String,
    fullname: String,
    email: String,
    phone: String,
    address: String,
    totalLiabilities: Number,
    createAt: Date,
    updateAt: Date,
    slug: { type: String, slug: 'fullname', unique: true },
})

const Debtor = mongoose.model('Debtor', DebtorSchema);
module.exports = Debtor;