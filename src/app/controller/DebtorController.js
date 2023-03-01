const Debtor = require('../models/Debtor');

function show(user, res, perPage, page) {
    perPage = Number(perPage) || 5;
    page = Number(page) || 1;
    Debtor.find({ createBy: user._id })
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .then(data => {
            data = data.map((d, index) => {
                d = d.toObject();
                d.stt = index + perPage * (page - 1) + 1;
                return d;
            });
            Debtor.countDocuments({ createBy: user._id })
                .then(count => {
                    res.json({ data, count, page });
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

class DebtorController {

    show(req, res) {
        if (req.session.user) {
            const user = req.session.user;
            res.render('debtor', { user, title: 'Finance' });
        } else {
            res.render('form/login');
        }
    }

    showDebtors(req, res) {
        let perPage = req.query.perPage || 5;
        let page = req.query.page || 1;
        const user = req.session.user;
        show(user, res, perPage, page);
    }

    addNew(req, res) {
        let debtor = req.body;
        const user = req.session.user;
        debtor.createBy = user._id;
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