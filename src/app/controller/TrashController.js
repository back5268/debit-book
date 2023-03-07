const Debt = require('../models/Debt');
const Debtor = require('../models/Debtor');
const { formatOptionDebt } = require('../../util/formatOptionFilter');
const { totalDebt, sortDebt } = require('../../util/handleDebt');

function showTrash(res, next, slug, options, perPage, page, sort) {
    options = formatOptionDebt(options);
    perPage = Number(perPage);
    page = Number(page);
    let sortCriteria = sortDebt(Number(sort));
    Debtor.find({ slug })
        .then(data => {
            let debtorId = data[0]._id;
            Debt.find({
                debtorId, isDelete: true, note: { $regex: options.note }, type: { $ne: options.type },
                monney: { $gte: options.minMonney, $lte: options.maxMonney },
                timeDebt: { $gte: options.minTimeDebt, $lte: options.maxTimeDebt },
                createAt: { $gte: options.minCreateAt, $lte: options.maxCreateAt },
                deleteAt: { $gte: options.minDeleteAt, $lte: options.maxDeleteAt },
            })
                .sort(sortCriteria)
                .skip((perPage * page) - perPage)
                .limit(perPage)
                .then(data => {
                    Debt.countDocuments({
                        debtorId, isDelete: true, note: { $regex: options.note }, type: { $ne: options.type },
                        monney: { $gte: options.minMonney, $lte: options.maxMonney },
                        timeDebt: { $gte: options.minTimeDebt, $lte: options.maxTimeDebt },
                        createAt: { $gte: options.minCreateAt, $lte: options.maxCreateAt },
                        deleteAt: { $gte: options.minDeleteAt, $lte: options.maxDeleteAt },
                    })
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
        options.minDeleteAt = req.query.minDeleteAt;
        options.maxDeleteAt = req.query.maxDeleteAt;
        let perPage = req.query.perPage || 5;
        let page = req.query.page || 1;
        let sort = req.query.sort || 12;
        const { slug } = req.params;
        showTrash(res, next, slug, options, perPage, page, sort);
    }

    restore(req, res, next) {
        let options = {};
        let perPage = req.query.perPage || 5;
        let page = req.query.page || 1;
        let sort = req.query.sort || 10;
        Debt.findOneAndUpdate({ _id: req.body.debtId }, { isDelete: false, deleteAt: null })
            .then(data => {
                let debt = data;
                Debtor.find({ _id: debt.debtorId })
                    .then(data => {
                        let totalDebts = totalDebt(debt, data[0].totalDebts);
                        Debtor.findOneAndUpdate({ _id: debt.debtorId }, { totalDebts, updateAt: Date.now() })
                            .then(() => {
                                showTrash(res, next, data[0].slug, options, perPage, page, sort);
                            })
                            .catch(next);
                    })
                    .catch(next);
            })
            .catch(next);
    }

}

module.exports = new TrashController;