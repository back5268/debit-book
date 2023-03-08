const User = require('../models/User');
const bcrypt = require('bcrypt');

class ProfileController {

    show(req, res) {
        if (req.session.user) {
            const user = req.session.user;
            res.render('profile', {
                user, title: 'Profile'
            });
        } else {
            res.render('form/login');
        }
    }

    updateUserInfo(req, res) {
        let { fullname, phone, address, description, userId } = req.body;
        User.findOneAndUpdate({ _id: userId }, { fullname, phone, address, description }, { new: true })
            .then(data => {
                req.session.user = data;
                res.status(200).json({ message: 'Update successful!' });
            })
            .catch(err => {
                console.log(err);
                res.status(403).json({ message: 'Update failed!' });
            })
    }

    updateUserAccount(req, res) {
        let { captcha, account, oldPassword, newPassword } = req.body;
        if (req.session.captcha == captcha) {
            oldPassword = oldPassword.trim();
            newPassword = newPassword.trim();
            if (oldPassword == '' || newPassword == '') {
                res.status(403).json({ message: 'Empty input fields!' });
            } else if (oldPassword.length < 6) {
                res.status(403).json({ message: 'oldPassword is too short!' });
            } else if (newPassword.length < 6) {
                res.status(403).json({ message: 'newPassword is too short!' });
            } else {
                User.find({ account })
                    .then(data => {
                        const hashedPassword = data[0].password;
                        bcrypt.compare(oldPassword, hashedPassword)
                            .then(data => {
                                if (data) {
                                    const saltRounds = 10;
                                    bcrypt.hash(newPassword, saltRounds)
                                        .then(data => {
                                            User.updateOne({ account }, { password: data })
                                                .then(() => {
                                                    res.status(200).json({ message: 'Update successful!' });
                                                })
                                                .catch(err => {
                                                    console.log(err);
                                                    res.status(403).json({ message: 'Update failed!' });
                                                })
                                        })
                                        .catch(err => {
                                            res.status(403).json({ message: 'Update failed!' });
                                        })
                                } else {
                                    res.status(403).json({ message: 'Incorrect oldPassword!' });
                                }
                            })
                            .catch(err => {
                                console.log(err);
                                res.status(403).json({ message: 'Update failed!' });
                            })
                    })
            }
        } else {
            res.status(403).json({ message: 'Incorrect captcha!' });
        }
    }

}

module.exports = new ProfileController;