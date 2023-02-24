const Debt = require('../models/Debt');
const { dateTimeHelper } = require('../../util/dateTimeHelper');

class TrashController {

    show(req, res, next) {
        if (req.session.user) {
            const user = req.session.user;
            Debt.find({ createBy: user._id, isDelete: true })
                .then(data => {
                    data = data.map((d, index) => {
                        d = d.toObject();
                        d.id = index + 1;
                        return d;
                    });
                    data = data.map(d => {
                        d.timeDebt = dateTimeHelper(d.timeDebt);
                        d.deleteAt = dateTimeHelper(d.deleteAt);
                        return d;
                    })
                    res.render('trashFinance', {
                        user, title: 'Finance', title2: '/ Trash', debts: data, totalRecord: data.length
                    });
                })
                .catch(next)
        } else {
            res.render('form/login');
        }
    }

}

module.exports = new TrashController;