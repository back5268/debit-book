const Debtor = require('../models/Debtor');
const { dateTimeHelper, formatMonney } = require('../../util/dateTimeHelper');

class DebtorController {

    show(req, res) {
        if (req.session.user) {
            const user = req.session.user;
            Debtor.find({ UserId: user._id })
                .then(data => {
                    data = data.map(d => d.toObject());
                    data = data.map(d => {
                        d.createAt = dateTimeHelper(d.createAt);
                        d.updateAt = dateTimeHelper(d.updateAt);
                        d.totalDebts = formatMonney(d.totalDebts);
                        return d;
                    })
                    res.render('debtor', {
                        user, title: 'Finance', debtors: data, totalRecord: data.length
                    });
                })
                .catch(err => {
                    console.log(err);
                    res.render('debtor', {
                        user, title: 'Finance'
                    });
                })
        } else {
            res.render('form/login');
        }
    }

    addNew(req, res) {
        let debtor = req.body;
        const user = req.session.user;
        debtor.UserId = user._id;
        debtor.totalDebts = 0;
        if (debtor.fullname) {
            const newDebtor = new Debtor(debtor);
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

    update(req, res) {
        let { debtorId, email, phone, address } = req.body;
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

module.exports = new DebtorController;