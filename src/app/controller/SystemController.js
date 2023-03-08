const User = require('../models/User');
const { sortUser, formatOptionsUser } = require('../../util/handleUser');

class SystemController {

    render(req, res) {
        if (req.session.user) {
            const user = req.session.user;
            if (user.role === 0) {
                res.render('control', { user, title: 'Control' });
            } else {
                res.render('home', { user, title: 'Home' });
            }
        } else {
            res.render('form/login');
        }
    };

    show(req, res, next) {
        let options = {};
        options.account = req.query.account;
        options.email = req.query.email;
        options.minCreateAt = req.query.minCreateAt;
        options.maxCreateAt = req.query.maxCreateAt;
        options.minLastLogin = req.query.minLastLogin;
        options.maxLastLogin = req.query.maxLastLogin;
        let page = Number(req.query.page) || 1;
        let perPage = Number(req.query.perPage) || 5;
        let sort = Number(req.query.sort) || 8;
        let sortCriteria = sortUser(Number(sort));
        options = formatOptionsUser(options);
        User.find({
            verified: true, account: { $regex: options.account }, email: { $regex: options.email },
            createAt: { $gte: options.minCreateAt, $lte: options.maxCreateAt },
            lastLogin: { $gte: options.minLastLogin, $lte: options.maxLastLogin },
        })
            .sort(sortCriteria)
            .skip((perPage * page) - perPage)
            .limit(perPage)
            .then(data => {
                data = data.map(d => d.toObject());
                User.countDocuments({
                    verified: true, account: { $regex: options.account }, email: { $regex: options.email },
                    createAt: { $gte: options.minCreateAt, $lte: options.maxCreateAt },
                    lastLogin: { $gte: options.minLastLogin, $lte: options.maxLastLogin },
                })
                    .then(count => {
                        res.status(200).json({ data, count, page });
                    })
                    .catch(next);
            })
            .catch(next);
    };

};

module.exports = new SystemController;