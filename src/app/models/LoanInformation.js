const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LoanInformationSchema = new Schema({
    debtorId: String,
    noteDebt: String,
    typeOfDebt: String,
    amountOfMoney: Number,
    timeDebt: Date,
    createAt: Date,
})

const LoanInformation = mongoose.model('LoanInformation', LoanInformationSchema);
module.exports = LoanInformation;