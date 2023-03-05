const Debt = require('../models/Debt');
const Debtor = require('../models/Debtor');
const { totalDebt, sortDebt } = require('../../util/handleDebt');

function show(res, slug, sort, next) {
    let sortCriteria = sortDebt(Number(sort));
    Debtor.find({ slug })
        .then(data => {
            let debtorId = data[0]._id;
            Debt.find({ debtorId, isDelete: true })
                .sort(sortCriteria)
                .then(data => {
                    Debt.countDocuments({ debtorId, isDelete: true })
                        .then(count => {
                            res.status(200).json({ data, count })
                        })
                        .catch(next)
                })
                .catch(next)
        })
        .catch(next)
}

class TrashController {

    show(req, res, next) {
        if (req.session.user) {
            const user = req.session.user;
            Debtor.find({ createBy: user._id })
                .then(data => {
                    data = data.map(d => d.toObject())
                    res.render('trashFinance', {
                        user, title: 'Finance', title2: '/ Trash', data
                    });
                })
                .catch(next)
        } else {
            res.render('form/login');
        }
    }

    showTrash(req, res, next) {
        if (req.session.user) {
            const { slug } = req.params;
            let sort = req.query.sort;
            show(res, slug, sort, next);
        } else {
            res.render('form/login');
        }
    }

    restore(req, res, next) {
        Debt.findOneAndUpdate({ _id: req.body.debtId }, { isDelete: false, deleteAt: null })
            .then(data => {
                let debt = data;
                Debtor.find({ _id: debt.debtorId })
                    .then(data => {
                        let totalDebts = totalDebt(debt, data[0].totalDebts);
                        Debtor.findOneAndUpdate({ _id: debt.debtorId }, { totalDebts, updateAt: Date.now() })
                            .then(() => {
                                show(res, data[0].slug, req.query.sort, next);
                            })
                            .catch(next)
                    })
                    .catch(next)
            })
            .catch(next);
    }

}

module.exports = new TrashController;