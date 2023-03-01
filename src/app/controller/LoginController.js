const User = require('../models/User');
const bcrypt = require('bcrypt');

class LoginController {

    loginGet(req, res) {
        res.render('form/login');
    }

    loginPost(req, res, next) {
        let { account, password, captcha } = req.body;
        if (req.session.captcha == captcha) {
            account = account.trim();
            password = password.trim();
            User.find({ account })
                .then(data => {
                    const user = data[0];
                    if (data.length) {
                        if (!data[0].verified) {
                            res.status(403).json({ message: 'Tài khoản chưa được xác minh. Vui lòng kiểm tra emai!' });
                        } else {
                            const hashedPassword = data[0].password;
                            bcrypt.compare(password, hashedPassword)
                                .then(data => {
                                    if (data) {
                                        User.findOneAndUpdate({ account }, { lastLogin: Date.now() })
                                            .then(data => {
                                                req.session.user = data;
                                                res.status(200).json({ user: data });
                                            })
                                            .catch(err => {
                                                console.log(err);
                                            })
                                    } else {
                                        res.status(403).json({ message: 'Mật khẩu không chính xác!' });
                                    }
                                })
                                .catch(err => {
                                    console.log(err);
                                    res.status(403).json({ message: 'Tài khoản hoặc mật khẩu không chính xác!' });
                                })
                        }
                    } else {
                        res.status(403).json({ message: 'Tài khoản không tồn tại!' });
                    }
                })
                .catch((err) => {
                    console.log(err);
                    res.status(403).json({ message: 'Tài khoản hoặc mật khẩu không chính xác!' });
                })
        } else {
            res.status(403).json({ message: 'Mã captcha không chính xác!' });
        }
    }

    logout(req, res) {
        req.session.destroy(err => {
            if (err) {
                res.status(500).send('Có lỗi khi đăng xuất!');
            } else {
                res.render('form/login');
            }
        });
    }

}

module.exports = new LoginController;