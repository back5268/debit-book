const User = require('../models/User');
const bcrypt = require('bcrypt');
const { verifyCaptcha } = require('../../util/verifyCaptcha');

class LoginController {

    loginGet(req, res) {
        res.render('login');
    }

    loginPost(req, res, next) {
        let { account, password, captcha } = req.body;
        verifyCaptcha(captcha, function (err, result) {
            if (err) {
                res.status(403).json({ error: 'Mã captcha không đúng!' });
            } else if (!result) {
                res.status(403).json({ error: 'Mã captcha không đúng!' });
            } else {
                account = account.trim();
                password = password.trim();
                User.find({ account })
                    .then(data => {
                        const user = data[0];
                        if (data.length) {
                            if (!data[0].verified) {
                                res.status(403).json({ error: 'Tài khoản chưa được xác minh. Vui lòng kiểm tra emai!' });
                            } else {
                                const hashedPassword = data[0].password;
                                bcrypt.compare(password, hashedPassword)
                                    .then(data => {
                                        if (data) {
                                            req.session.user = user;
                                            res.json({ user });
                                        } else {
                                            res.status(403).json({ error: 'Mật khẩu không chính xác!' });
                                        }
                                    })
                                    .catch(err => {
                                        console.log(err);
                                        res.status(403).json({ error: 'Tài khoản hoặc mật khẩu không chính xác!' });
                                    })
                            }
                        } else {
                            res.status(403).json({ error: 'Tài khoản không tồn tại!' });
                        }
                    })
                    .catch((err) => {
                        console.log(err);
                        res.status(403).json({ error: 'Tài khoản hoặc mật khẩu không chính xác!' });
                    })

            }
        })
    }

    logout(req, res) {
        req.session.destroy(err => {
            if (err) {
                res.status(500).send('Có lỗi khi đăng xuất!');
            } else {
                res.render('login');
            }
        });
    }

}

module.exports = new LoginController;