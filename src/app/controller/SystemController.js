const User = require('../models/User');

class SystemController {

    show(req, res, next) {
        if (req.session.user) {
            const user = req.session.user;
            if (user.role === 0) {
                User.find({ verified: true })
                    .then(data => {
                        data = data.map(d => d.toObject());
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