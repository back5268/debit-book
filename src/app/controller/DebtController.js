const Debtor = require('../models/Debtor');
const Debt = require('../models/Debt');
const { formatOptionDebt } = require('../../util/formatOptionFilter');
const { totalDebt, sortDebt } = require('../../util/handleDebt');

function showDebt(res, next, slug, options, perPage, page, sort) {
    options = formatOptionDebt(options);
    perPage = Number(perPage);
    page = Number(page);
    let sortCriteria = sortDebt(Number(sort));
    Debtor.find({ slug })
        .then(data => {
            const debtorId = data[0]._id;
            Debt.find({
                debtorId, isDelete: false, note: { $regex: options.note }, type: { $ne: options.type },
                monney: { $gte: options.minMonney, $lte: options.maxMonney },
                timeDebt: { $gte: options.minTimeDebt, $lte: options.maxTimeDebt },
                createAt: { $gte: options.minCreateAt, $lte: options.maxCreateAt },
            })
                .sort(sortCriteria)
                .skip((perPage * page) - perPage)
                .limit(perPage)
                .then(data => {
                    data = data.map(d => d = d.toObject());
                    Debt.countDocuments({
                        debtorId, isDelete: false, note: { $regex: options.note }, type: { $ne: options.type },
                        monney: { $gte: options.minMonney, $lte: options.maxMonney },
                        timeDebt: { $gte: options.minTimeDebt, $lte: options.maxTimeDebt },
                        createAt: { $gte: options.minCreateAt, $lte: options.maxCreateAt },
                    })
                        .then(count => {
                            res.status(200).json({ data, count, page });
                        })
                        .catch(next);
                })
                .catch(next);
        })
        .catch(next);
};

class DebtController {

    // [GET] /finance/debt/:slug
    render(req, res, next) {
        if (req.session.user) {
            const user = req.session.user;
            const { slug } = req.params;
            Debtor.find({ slug, createBy: user._id })
                .then(data => {
                    let debtor = data[0].toObject();
                    res.render('debt', { user, title: 'Finance', title2: '/ Detail', debtor });
                })
                .catch(next);
        } else {
            res.render('form/login');
        };
    };

    // [GET] /finance/debt/show/:slug
    show(req, res, next) {
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
        options.minCreateAt = req.query.minCreateAt;
        options.maxCreateAt = req.query.maxCreateAt;
        let perPage = req.query.perPage || 5;
        let page = req.query.page || 1;
        let sort = req.query.sort || 10;
        const { slug } = req.params;
        showDebt(res, next, slug, options, perPage, page, sort);
    };

    // [POST] /finance/debt/add
    add(req, res, next) {
        let debt = req.body;
        let options = {};
        let perPage = req.query.perPage || 5;
        let page = req.query.page || 1;
        let sort = req.query.sort || 10;
        const user = req.session.user;
        if (Number(debt.monney) > 0) {
            if (!debt.timeDebt) debt.timeDebt = Date.now();
            debt.isDelete = false;
            debt.createBy = user._id;
            debt.monney = Number(debt.monney);
            const newDebt = new Debt(debt);
            newDebt.save()
                .then(() => {
                    Debtor.find({ _id: debt.debtorId, createBy: user._id })
                        .then(data => {
                            let totalDebts = totalDebt(debt, data[0].totalDebts);
                            let updateDescription = 'Thêm khoản nợ';
                            Debtor.findOneAndUpdate({ _id: debt.debtorId }, { totalDebts, updateAt: Date.now(), updateDescription })
                                .then(() => {
                                    showDebt(res, next, data[0].slug, options, perPage, page, sort);
                                })
                                .catch(next);
                        })
                        .catch(next);
                })
                .catch(next);
        } else {
            res.status(403).json({ message: 'Vui lòng nhập giá trị lớn hơn 0!' });
        };
    };

    // [POST] /finance/debt/delete
    delete(req, res, next) {
        let options = {};
        let perPage = req.query.perPage || 5;
        let page = req.query.page || 1;
        let sort = req.query.sort || 10;
        const user = req.session.user;
        Debt.findOneAndUpdate({ _id: req.body.debtId }, { isDelete: true, deleteAt: Date.now() })
            .then(data => {
                let debt = data;
                debt.monney = -debt.monney;
                Debtor.find({ _id: debt.debtorId, createBy: user._id })
                    .then(data => {
                        let totalDebts = totalDebt(debt, data[0].totalDebts);
                        let updateDescription = 'Xóa khoản nợ';
                        Debtor.findOneAndUpdate({ _id: debt.debtorId }, { totalDebts, updateAt: Date.now(), updateDescription })
                            .then(() => {
                                showDebt(res, next, data[0].slug, options, perPage, page, sort);
                            })
                            .catch(next);
                    })
                    .catch(next);
            })
            .catch(next);
    };

};

module.exports = new DebtController;