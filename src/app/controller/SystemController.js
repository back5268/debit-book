const User = require('../models/User');
const { dateTimeHelper } = require('../../util/dateTimeHelper');

class SystemController {

    show(req, res, next) {
        if (req.session.user) {
            const user = req.session.user;
            if (user.role === 0) {
                User.find({})
                    .then(data => {
                        data = data.map(d => d.toObject());
                        data = data.map(d => {
                            d.lastLogin = dateTimeHelper(d.lastLogin);
                            d.createAt = dateTimeHelper(d.createAt);
                            return d;
                        })
                        res.render('control', { 
                            user, title: 'Control', users: data, totalRecord: data.length 
                        });
                    })
                    .catch(err => {
                        console.log(err);
                        next(err);
                    })
            } else {
                res.render('home', { 
                    user, title: 'Home' 
                });
            }
        } else {
            res.render('form/login');
        }
    }

}

module.exports = new SystemController;