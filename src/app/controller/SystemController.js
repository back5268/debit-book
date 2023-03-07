const User = require('../models/User');
const { sortUser } = require('../../util/handleUser');

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
    }

    show(req, res, next) {
        let page = Number(req.query.page) || 1;
        let perPage = Number(req.query.perPage) || 5;
        let sort = Number(req.query.sort) || 5;
        let sortCriteria = sortUser(Number(sort));
        User.find({ verified: true })
            .sort(sortCriteria)
            .skip((perPage * page) - perPage)
            .limit(perPage)
            .then(data => {
                data = data.map(d => d.toObject());
                User.countDocuments({ verified: true })
                    .then(count => {
                        res.status(200).json({ data, count, page });
                    })
                    .catch(next);
            })
            .catch(next);
    }

}

module.exports = new SystemController;