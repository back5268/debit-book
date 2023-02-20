const Debtor = require('../models/Debtor');
const LoanInformation = require('../models/LoanInformation');
const { dateTimeHelper } = require('../../util/dateTimeHelper');
const { searchDebt } = require('../../util/searchDebt');

function showDetail(slug, user, res, options) {
    Debtor.find({ slug })
        .then(data => {
            let debtor = data[0];
            const debtorId = data[0]._id;
            LoanInformation.find({ debtorId })
                .then(data => {
                    data = data.map((d, index) => {
                       d = d.toObject();
                       d.id = index + 1;
                       return d;
                    });
                    data = searchDebt(data, options);
                    data = data.map(d => {
                        d.createAt = dateTimeHelper(d.createAt);
                        d.timeDebt = dateTimeHelper(d.timeDebt);
                        return d;
                    })
                    debtor = debtor.toObject();
                    if (!options.typeOfDebt) {
                        res.render('detailFinances', {
                            user, title: 'Finance', title2: '/ detail', loanInformations: data, debtor
                        });
                    } else {
                        res.status(200).json({ debt: data });
                    }
                })
                .catch(err => {
                    console.log(err);
                    res.status(403).json({ message: 'Not found!' });
                })
        })
        .catch(err => {
            console.log(err);
            res.status(403).json({ message: 'Not found!' });
        })
}

class FinancesController {

    show(req, res) {
        if (req.session.user) {
            const user = req.session.user;
            Debtor.find({ UserId: user._id })
                .then(data => {
                    data = data.map(d => d.toObject());
                    data = data.map(d => {
                        d.createAt = dateTimeHelper(d.createAt);
                        d.updateAt = dateTimeHelper(d.updateAt);
                        return d;
                    })
                    res.render('finance', {
                        user, title: 'Finance', debtors: data, totalRecord: data.length
                    });
                })
                .catch(err => {
                    console.log(err);
                    res.render('finance', {
                        user, title: 'Finance'
                    });
                })
        } else {
            res.render('form/login');
        }
    }

    createNewDebtor(req, res) {
        const { fullname, phone, address, email } = req.body;
        const user = req.session.user;
        if (fullname) {
            const newDebtor = new Debtor({
                UserId: user._id,
                fullname,
                phone,
                address,
                email,
                totalLiabilities: 0,
                createAt: Date.now(),
                updateAt: Date.now(),
            });
            newDebtor.save()
                .then(() => {
                    res.json({ message: 'Thêm thông tin người nợ thành công!' });
                })
                .catch(err => {
                    console.log(err);
                    res.status(403).json({ message: 'Không thể thêm người nợ!' });
                })
        } else {
            res.status(403).json({ message: 'Vui lòng nhập tên đầy đủ của người nợ!' });
        }

    }

    addNewDebt(req, res) {
        const { debtorId, noteDebt, typeOfDebt, amountOfMoney, timeDebt } = req.body;
        if (amountOfMoney != 0) {
            const newLoanInformation = new LoanInformation({
                debtorId,
                noteDebt,
                typeOfDebt,
                amountOfMoney,
                timeDebt,
                createAt: Date.now(),
            })
            newLoanInformation.save()
                .then(() => {
                    res.json({ message: 'Thêm thông tin khoản nợ thành công!' });
                })
                .catch(err => {
                    console.log(err);
                    res.status(403).json({ message: 'Không thể thêm Thông tin khoản nợ!' });
                })
        } else {
            res.status(403).json({ message: 'Vui lòng nhập giá trị khác 0!' });
        }
    }

    showDetail(req, res, next) {
        if (req.session.user) {
            const { slug } = req.params;
            const user = req.session.user;
            let options = {};
            showDetail(slug, user, res, options);
        } else {
            res.render('form/login');
        }
    }

    searchDebt(req, res, next) {
        let options = req.body;
        const user = req.session.user;
        showDetail(options.slug, user, res, options);
    }

    updateDebtor(req, res) {
        const { debtorId, email, phone, address } = req.body;
        Debtor.findByIdAndUpdate({ _id: debtorId }, { email, phone, address })
            .then(() => {
                res.status(200).json({ message: 'Update successful!' });
            })
            .catch(err => {
                console.log(err);
                res.status(403).json({ message: 'Update failed!' });
            })
    }

}

module.exports = new FinancesController;