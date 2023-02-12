const User = require('../models/User');
const captchaController = require('./CaptchaController');
const bcrypt = require('bcrypt');
const captchaURL = `/captcha`;

class LoginController {

    loginGet(req, res) {
        res.render('login', { captchaURL });
    }

    loginPost(req, res, next) {
        let { email, password, captcha } = req.body;
        if (captcha === req.session.captcha) {
            email = email.trim();
            password = password.trim();
            User.find({ email })
                .then(data => {
                    const user = data[0];
                    if (data.length) {
                        if (!data[0].verified) {
                            const error = 'Tài khoản chưa được xác minh. Vui lòng kiểm tra emai!';
                            res.render('login', { error, captchaURL });
                        } else {
                            const hashedPassword = data[0].password;
                            bcrypt.compare(password, hashedPassword)
                                .then(data => {
                                    if (data) {
                                        req.session.user = user;
                                        res.json({ user });
                                        // res.render('home', {
                                        //     user: user.toObject(),
                                        // });
                                    } else {
                                        res.status(403).send({ error: 'Mật khẩu không chính xác!' });
                                    }
                                })
                                .catch(err => {
                                    console.log(err);
                                    res.status(403).send({ error: 'Tài khoản hoặc mật khẩu không chính xác!' });
                                })
                        }
                    } else {
                        res.status(403).send({ error: 'Tài khoản không tồn tại!' });
                    }
                })
                .catch((err) => {
                    console.log(err);
                    res.status(403).send({ error: 'Tài khoản hoặc mật khẩu không chính xác!' });
                })

        } else {
            res.status(403).send({ error: 'Mã captcha không đúng!' });
        }
    }

    logout(req, res) {
        req.session.destroy(err => {
            if (err) {
                res.status(500).send('Error while logging out');
            } else {
                res.render('login', { captchaURL });
            }
        });
    }

}

module.exports = new LoginController;