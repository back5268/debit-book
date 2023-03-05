const Debtor = require('../models/Debtor');
const Debt = require('../models/Debt');
const { formatOptionDebt } = require('../../util/formatOptionFilter');
const { totalDebt, sortDebt } = require('../../util/handleDebt');

function show(slug, res, options, perPage, page, sort) {
    perPage = perPage || 5;
    page = Number(page) || 1;
    options = formatOptionDebt(options);
    Debtor.find({ slug })
        .then(data => {
            const debtorId = data[0]._id;
            let sortCriteria = sortDebt(Number(sort));
            Debt.find({ debtorId, isDelete: false, note: { $regex: options.note }, type: { $ne: options.type }, 
                        monney: {$gte: options.minMonney, $lte: options.maxMonney},
                        timeDebt: {$gte: options.minTimeDebt, $lte: options.maxTimeDebt},
                        createAt: {$gte: options.minTimeCreate, $lte: options.maxTimeCreate},
                     })
                .sort( sortCriteria )
                .skip((perPage * page) - perPage)
                .limit(perPage)
                .then(data => {
                    data = data.map((d, index) => {
                        d = d.toObject();
                        d.stt = index + perPage * (page - 1) + 1;
                        return d;
                    });
                    Debt.countDocuments({ debtorId, isDelete: false, note: { $regex: options.note }, type: { $ne: options.type }, 
                                          monney: {$gte: options.minMonney, $lte: options.maxMonney},
                                          timeDebt: {$gte: options.minTimeDebt, $lte: options.maxTimeDebt},
                                          createAt: {$gte: options.minTimeCreate, $lte: options.maxTimeCreate},
                                        })
                        .then(count => {
                            res.status(200).json({ data, count, page });
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
        })
        .catch(err => {
            console.log(err);
            res.status(403).json({ message: 'Not found!' });
        })
}

class DebtController {

    show(req, res, next) {
        if (req.session.user) {
            const user = req.session.user;
            const { slug } = req.params;
            Debtor.find({ slug })
                .then(data => {
                    let debtor = data[0].toObject();
                    res.render('detailDebtor', { user, title: 'Finance', title2: '/ Detail', debtor });
                })
                .catch(next);
        } else {
            res.render('form/login');
        }
    }

    getDebtor(req, res, next) {
        if (req.session.user) {
            const { slug } = req.params;
            Debtor.find({ slug })
                .then(data => {
                    data = data[0].toObject();
                    res.json({ data });
                })
                .catch(next);
        } else {
            res.render('form/login');
        }
    }

    showDebts(req, res) {
        const { slug } = req.params;
        let options = {};
        options.note = req.query.note;
        options.type = req.query.type;
        if (options.type == '0') options.type = '-';
        else if (options.type == '1') options.type = '+';
        else options.type = '';
        options.minMonney = req.query.minMonney;
        options.maxMonney = req.query.maxMonney;
        options.minTimeDebt = req.query.minTimeDebt;
        options.maxTimeDebt = req.query.maxTimeDebt;
        options.minTimeCreate = req.query.minTimeCreate;
        options.maxTimeCreate = req.query.maxTimeCreate;
        let perPage = req.query.perPage || 5;
        let page = req.query.page || 1;
        let sort = req.query.sort || 1;
        show(slug, res, options, perPage, page, sort);
    }

    addNew(req, res) {
        const user = req.session.user;
        let debt = req.body;
        let options = {};
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
                            Debtor.findOneAndUpdate({ _id: debt.debtorId }, { totalDebts, updateAt: Date.now() })
                                .then(() => {
                                    show(data[0].slug, res, options, Number(debt.perPage), 1, 1);
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

    delete(req, res) {
        let options = {};
        let perPage = req.query.perPage || 5;
        Debt.findOneAndUpdate({ _id: req.body.debtId }, { isDelete: true, deleteAt: Date.now() })
            .then(data => {
                let debt = data;
                debt.monney = -debt.monney;
                Debtor.find({ _id: debt.debtorId })
                    .then(data => {
                        let totalDebts = totalDebt(debt, data[0].totalDebts);
                        Debtor.findOneAndUpdate({ _id: debt.debtorId }, { totalDebts, updateAt: Date.now() })
                            .then(() => {
                                show(data[0].slug, res, options, perPage, 1, 1);
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

}

module.exports = new DebtController;