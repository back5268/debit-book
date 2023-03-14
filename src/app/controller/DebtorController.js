const Debtor = require('../models/Debtor');
const { formatOptionsDebtor } = require('../../util/formatOptionFilter');
const { sortDebtor } = require('../../util/handleDebt');

function showDebtor(res, next, user, options, perPage, page, sort) {
    options = formatOptionsDebtor(options);
    perPage = Number(perPage);
    page = Number(page);
    let sortCriteria = sortDebtor(Number(sort));
    Debtor.find({
        createBy: user._id, name: { $regex: options.name }, address: { $regex: options.address },
        email: { $regex: options.email }, phone: { $regex: options.phone },
        totalDebts: { $gte: options.minMonney, $lte: options.maxMonney },
        createAt: { $gte: options.minCreateAt, $lte: options.maxCreateAt },
        updateAt: { $gte: options.minUpdateAt, $lte: options.maxUpdateAt },
    })
        .sort(sortCriteria)
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .then(data => {
            data = data.map(d => d.toObject());
            Debtor.countDocuments({
                createBy: user._id, name: { $regex: options.name }, address: { $regex: options.address },
                email: { $regex: options.email }, phone: { $regex: options.phone },
                totalDebts: { $gte: options.minMonney, $lte: options.maxMonney },
                createAt: { $gte: options.minCreateAt, $lte: options.maxCreateAt },
                updateAt: { $gte: options.minUpdateAt, $lte: options.maxUpdateAt },
            })
                .then(count => {
                    res.json({ data, count, page });
                })
                .catch(next);
        })
        .catch(next);
};

class DebtorController {

    // [GET] /finance/debtor
    render(req, res) {
        if (req.session.user) {
            const user = req.session.user;
            res.render('debtor', { user, title: 'Finance' });
        } else {
            res.render('form/login');
        };
    };

    // [GET] /finance/debtor/show
    show(req, res, next) {
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
        let sort = req.query.sort || 12;
        const user = req.session.user;
        showDebtor(res, next, user, options, perPage, page, sort);
    };

    // [POST] /finance/debtor/add
    add(req, res, next) {
        const user = req.session.user;
        let debtor = req.body;
        debtor.createBy = user._id;
        debtor.totalDebts = 0;
        let options = {};
        let perPage = req.query.perPage || 6;
        let page = req.query.page || 1;
        let sort = req.query.sort || 12;
        if (debtor.name != '') {
            Debtor.find({ name: debtor.name, createBy: user._id })
                .then(data => {
                    if (data[0]) {
                        res.status(403).json({ message: 'Tên người nợ đã tồn tại!' });
                    } else {
                        const newDebtor = new Debtor(debtor);
                        newDebtor.save()
                            .then(() => {
                                showDebtor(res, next, user, options, perPage, page, sort);
                            })
                            .catch(next);
                    }
                })
                .catch(next);
        } else {
            res.status(403).json({ message: 'Vui lòng nhập tên của người nợ!' });
        }
    }

    // [GET] /finance/debtor/:slug
    info(req, res, next) {
        const user = req.session.user;
        const { slug } = req.params;
        Debtor.find({ slug, createBy: user._id })
            .then(data => {
                data = data[0].toObject();
                res.json({ data });
            })
            .catch(next);
    }

    // [POST] /finance/debtor/update
    update(req, res, next) {
        let { debtorId, email, phone, address } = req.body;
        const user = req.session.user;
        Debtor.findOneAndUpdate({ _id: debtorId, createBy: user._id }, { email, phone, address })
            .then(() => {
                res.status(200).json({ message: 'Update successful!' });
            })
            .catch(next);
    }

}

module.exports = new DebtorController;