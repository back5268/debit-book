const User = require('../models/User');
const bcrypt = require('bcrypt');
const captchaURL = `/captcha`;

class LoginController {

    loginGet(req, res) {
        res.render('login', { captchaURL });
    }

    loginPost(req, res) {
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
                                        req.session.userName = user.name;
                                        req.session.userId = user._id;
                                        const userName = req.session.userName;
                                        const userId = req.session.userId;
                                        res.render('home', { userName, userId });
                                    } else {
                                        const error = 'Mật khẩu không chính xác!';
                                        res.render('login', { error, captchaURL });
                                    }
                                })
                                .catch(err => {
                                    console.log(err);
                                    const error = 'Tài khoản hoặc mật khẩu không chính xác!';
                                    res.render('login', { error, captchaURL });
                                })
                        }
                    } else {
                        const error = 'Tài khoản không tồn tại!';
                        res.render('login', { error, captchaURL });
                    }
                })
                .catch((err) => {
                    console.log(err);
                    const error = 'Tài khoản hoặc mật khẩu không chính xác!';
                    res.render('login', { error, captchaURL });
                })

        } else {
            const error = 'Mã captcha không đúng!';
            res.render('login', { error, captchaURL });
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