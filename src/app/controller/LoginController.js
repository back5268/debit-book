const User = require('../models/User');
const bcrypt = require('bcrypt');

class LoginController {

    // [GET] /login
    loginGet(req, res) {
        res.render('form/login');
    }

    // [POST] /login
    loginPost(req, res) {
        let { account, password, captcha } = req.body;
        if (req.session.captcha === captcha) {
            account = account.trim();
            password = password.trim();

            if (account == '' || password == '') {
                res.status(403).json({ message: 'Empty input fields!' });
            } else if (password.length < 6) {
                res.status(403).json({ message: 'Password is too short!' });
            } else {
                User.find({ account })
                    .then(data => {
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
            }
        } else {
            res.status(403).json({ message: 'Mã captcha không chính xác!' });
        }
    }

    // [GET] /logout
    logout(req, res) {
        req.session.destroy(err => {
            if (err) {
                res.status(403).send('Có lỗi khi đăng xuất!');
            } else {
                res.render('form/login');
            }
        });
    }

}

module.exports = new LoginController;