const User = require('../models/User');

class ProfileController {

    show(req, res) {
        if (req.session.user) {
            const user = req.session.user;
            res.render('profile', {
                user, title: 'Profile'
            });
        } else {
            res.render('login');
        }
    }

    updateUserInfo(req, res) {
        const { fullname, phone, email, address, description, userId } = req.body;
        User.findOneAndUpdate({ _id: userId}, { fullname, phone, address, description }, { new: true })
            .then(data => {
                req.session.user = data;
                res.status(200).json({ error: 'Update successful!' });
            })
            .catch(err => {
                console.log(err);
                res.status(403).json({ error: 'Update failed!' });
            })
    }

    updateUserAccount(req, res) {

    }

}

module.exports = new ProfileController;