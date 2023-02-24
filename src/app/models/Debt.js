const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DebtSchema = new Schema({
    debtorId: String,
    note: String,
    type: String,
    monney: Number,
    timeDebt: { type: Date, default: Date.now },
    createAt: { type: Date, default: Date.now },
    deleteAt: Date,
    isDelete: Boolean,
    createBy: String,
})

const Debt = mongoose.model('Debt', DebtSchema);
module.exports = Debt;