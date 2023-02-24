const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const slug = require('mongoose-slug-generator');
mongoose.plugin(slug);

const DebtorSchema = new Schema({
    fullname: String,
    email: String,
    phone: String,
    address: String,
    totalDebts: Number,
    createAt: { type: Date, default: Date.now },
    updateAt: { type: Date, default: Date.now },
    deleteAt: Date,
    isDelete: Boolean,
    createBy: String,
    slug: { type: String, slug: 'fullname', unique: true },
})

const Debtor = mongoose.model('Debtor', DebtorSchema);
module.exports = Debtor;