const Debt = require('../models/Debt');
const Debtor = require('../models/Debtor');

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
            let sortCriteria;
            Debtor.find({ slug })
                .then(data => {
                    Debt.find({ debtorId: data[0]._id, isDelete: true })
                        .sort(sortCriteria)
                        .then(data => {
                            Debt.countDocuments({ slug, isDelete: true })
                                .then(count => {
                                    res.status(200).json({ data, count })
                                })
                                .catch(next)
                        })
                        .catch(next)
                })
                .catch(next)
        } else {
            res.render('form/login');
        }
    }

}

module.exports = new TrashController;