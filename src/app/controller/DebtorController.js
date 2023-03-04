const Debtor = require('../models/Debtor');
const { formatOptionsDebtor } = require('../../util/fomatOptionsDebtor');

function show(user, res, options, perPage, page) {
    options = formatOptionsDebtor(options);
    perPage = Number(perPage) || 6;
    page = Number(page) || 1;
    Debtor.find({
        createBy: user._id, fullname: { $regex: options.name }, address: { $regex: options.address },
        email: { $regex: options.email }, phone: { $regex: options.phone },
        totalDebts: { $gte: options.minMonney, $lte: options.maxMonney },
        createAt: { $gte: options.minCreateAt, $lte: options.maxCreateAt },
        updateAt: { $gte: options.minUpdateAt, $lte: options.maxUpdateAt },
    })
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .then(data => {
            data = data.map((d, index) => {
                d = d.toObject();
                d.stt = index + perPage * (page - 1) + 1;
                return d;
            });
            Debtor.countDocuments({
                createBy: user._id, fullname: { $regex: options.name }, address: { $regex: options.address },
                email: { $regex: options.email }, phone: { $regex: options.phone },
                totalDebts: { $gte: options.minMonney, $lte: options.maxMonney },
                createAt: { $gte: options.minCreateAt, $lte: options.maxCreateAt },
                updateAt: { $gte: options.minUpdateAt, $lte: options.maxUpdateAt },
            })
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
        let options = {};
        options.name = req.query.name;
        options.address = req.query.address;
        options.phone = req.query.phone;
        options.email = req.query.email;
        options.minMonney = req.query.minMonney;
        options.maxMonney = req.query.maxMonney;
        options.minCreateAt = req.query.minCreateAt;
        options.maxCreateAt = req.query.maxCreateAt;
        options.minUpdateAt = req.query.minUpdateAt;
        options.maxUpdateAt = req.query.maxUpdateAt;
        let perPage = req.query.perPage || 6;
        let page = req.query.page || 1;
        const user = req.session.user;
        show(user, res, options, perPage, page);
    }

    addNew(req, res) {
        let debtor = req.body;
        console.log(debtor);
        const user = req.session.user;
        debtor.createBy = user._id;
        debtor.totalDebts = 0;
        let options = {};
        if (debtor.fullname != '') {
            const newDebtor = new Debtor(debtor);
            newDebtor.save()
                .then(() => {
                    show(user, res, options, debtor.perPage, debtor.page);
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