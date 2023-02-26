const Debtor = require('../models/Debtor');
const Debt = require('../models/Debt');
const { dateTimeHelper } = require('../../util/dateTimeHelper');
const { searchDebt } = require('../../util/searchDebt');
const { totalDebt } = require('../../util/totalDebts');

function show(slug, user, res, options, perPage, page) {
    Debtor.find({ slug })
        .then(data => {
            let debtor = data[0];
            const debtorId = data[0]._id;
            Debt.find({ debtorId, isDelete: false })
                .skip((perPage * page) - perPage)
                .limit(perPage)
                .then(data => {
                    data = data.map((d, index) => {
                        d = d.toObject();
                        d.id = index + perPage*(page - 1) + 1;
                        return d;
                    });
                    data = searchDebt(data, options);
                    data = data.map(d => {
                        d.timeDebt = dateTimeHelper(d.timeDebt);
                        d.createAt = dateTimeHelper(d.createAt);
                        return d;
                    })
                    if (!options.type) {
                        Debt.countDocuments({ debtorId, isDelete: false })
                            .then(count => {
                                let pages = Math.ceil(count / perPage);
                                pages = ( pages === 0) ? 1 : pages;
                                res.render('detailDebtor', {
                                    user, title: 'Finance', title2: '/ Detail', debts: data, 
                                    debtor: debtor.toObject(), pages,
                                    currentPage: page
                                });
                            })
                            .catch(err => {
                                console.log(err);
                                res.status(403).json({ message: 'Not found!' });
                            })
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

class DebtController {

    show(req, res) {
        if (req.session.user) {
            console.log(req.query);
            const { slug } = req.params;
            const user = req.session.user;
            let options = {};
            let perPage = req.query.perPage || 5; // số lượng sản phẩm xuất hiện trên 1 page
            let page = req.query.page || 1; 
            show(slug, user, res, options, perPage, page);
        } else {
            res.render('form/login');
        }
    }

    addNew(req, res) {
        const user = req.session.user;
        let debt = req.body;
        if (Number(debt.monney) > 0) {
            if (!debt.timeDebt) debt.timeDebt = Date.now();
            debt.isDelete = false;
            debt.createBy = user._id;
            debt.monney = Number(debt.monney);
            const newDebt = new Debt(debt);
            newDebt.save()
                .then(() => {
                    Debtor.find({ _id: debt.debtorId })
                        .then(data => {
                            let totalDebts = totalDebt(debt, data[0].totalDebts);
                            Debtor.findOneAndUpdate({ _id: debt.debtorId }, { totalDebts })
                                .then(() => {
                                    res.json({ message: 'Thêm thông tin khoản nợ thành công!' });
                                })
                                .catch(err => {
                                    console.log(err);
                                    res.status(403).json({ message: 'Không thể thêm Thông tin khoản nợ!' });
                                })
                        })
                        .catch(err => {
                            console.log(err);
                            res.status(403).json({ message: 'Không thể thêm Thông tin khoản nợ!' });
                        })
                })
                .catch(err => {
                    console.log(err);
                    res.status(403).json({ message: 'Không thể thêm Thông tin khoản nợ!' });
                })
        } else {
            res.status(403).json({ message: 'Vui lòng nhập giá trị lớn hơn 0!' });
        }
    }

    search(req, res) {
        let options = req.body;
        const user = req.session.user;
        show(options.slug, user, res, options);
    }

    delete(req, res) {
        Debt.findOneAndUpdate({ _id: req.body.debtId }, { isDelete: true, deleteAt: Date.now() })
            .then(data => {
                let debt = data;
                debt.monney = -debt.monney;
                Debtor.find({ _id: debt.debtorId })
                    .then(data => {
                        let totalDebts = totalDebt(debt, data[0].totalDebts);
                        Debtor.findOneAndUpdate({ _id: debt.debtorId }, { totalDebts })
                                .then(() => {
                                    res.status(200).json({ message: 'Xóa khoản nợ thành công!' });
                                })
                                .catch(err => {
                                    console.log(err);
                                    res.status(400).json({ message: 'Không thể xóa khoản nợ!' })
                                })
                    })
                    .catch(err => {
                        console.log(err);
                        res.status(400).json({ message: 'Không thể xóa khoản nợ!' })
                    })
            })
            .catch(err => {
                console.log(err);
                res.status(400).json({ message: 'Không thể xóa khoản nợ!' })
            });
    }

    restore(req, res, next) {
        Debt.findOneAndUpdate({ _id: req.params.id }, { isDelete: false, deleteAt: null })
            .then(data => {
                let debt = data;
                Debtor.find({ _id: debt.debtorId })
                    .then(data => {
                        let totalDebts = totalDebt(debt, data[0].totalDebts);
                        Debtor.findOneAndUpdate({ _id: debt.debtorId }, { totalDebts })
                                .then(() => {
                                    res.redirect('back');
                                })
                                .catch(next)
                    })
                    .catch(next)
            })
            .catch(next);
    }

}

module.exports = new DebtController;