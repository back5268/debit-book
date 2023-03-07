const Debt = require('../models/Debt');
const Debtor = require('../models/Debtor');
const { totalDebt, sortDebt } = require('../../util/handleDebt');

function showTrash(res, next, slug, perPage, page, sort) {
    perPage = Number(perPage);
    page = Number(page);
    let sortCriteria = sortDebt(Number(sort));
    Debtor.find({ slug })
        .then(data => {
            let debtorId = data[0]._id;
            Debt.find({ debtorId, isDelete: true })
                .sort(sortCriteria)
                .skip((perPage * page) - perPage)
                .limit(perPage)
                .then(data => {
                    Debt.countDocuments({ debtorId, isDelete: true })
                        .then(count => {
                            res.status(200).json({ data, count, page })
                        })
                        .catch(next);
                })
                .catch(next);
        })
        .catch(next);
}

class TrashController {

    render(req, res, next) {
        if (req.session.user) {
            const user = req.session.user;
            Debtor.find({ createBy: user._id })
                .then(data => {
                    data = data.map(d => d.toObject())
                    res.render('trash', { user, title: 'Finance', title2: '/ Trash', data });
                })
                .catch(next);
        } else {
            res.render('form/login');
        }
    }

    show(req, res, next) {
        let perPage = req.query.perPage || 5;
        let page = req.query.page || 1;
        let sort = req.query.sort || 12;
        const { slug } = req.params;
        showTrash(res, next, slug, perPage, page, sort);
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
                                showTrash(res, next, data[0].slug, perPage, page, sort);
                            })
                            .catch(next);
                    })
                    .catch(next);
            })
            .catch(next);
    }

}

module.exports = new TrashController;