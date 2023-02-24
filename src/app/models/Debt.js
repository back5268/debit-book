const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DebtSchema = new Schema({
    debtorId: String,
    debtorName: String,
    note: String,
    type: String,
    monney: Number,
    timeDebt: { type: Date, default: Date.now },
    createAt: { type: Date, default: Date.now },
    deleteAt: { type: Date, default: null },
    isDelete: Boolean,
    createBy: String,
})

const Debt = mongoose.model('Debt', DebtSchema);
module.exports = Debt;