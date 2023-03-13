const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const slug = require('mongoose-slug-generator');
mongoose.plugin(slug);

const DebtorSchema = new Schema({
    name: String,
    email: String,
    phone: String,
    address: String,
    totalDebts: Number,
    createAt: { type: Date, default: Date.now },
    updateAt: { type: Date, default: Date.now },
    updateDescription: { type: String, default: '' },
    deleteAt: Date,
    isDelete: Boolean,
    createBy: String,
    slug: { type: String, slug: 'name', unique: true },
})

const Debtor = mongoose.model('Debtor', DebtorSchema);
module.exports = Debtor;