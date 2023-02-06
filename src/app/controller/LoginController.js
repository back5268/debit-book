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
                    if (data.length) {
                        if (!data[0].verified) {
                            const error = 'Tài khoản chưa được xác minh. Vui lòng kiểm tra emai!';
                            res.render('login', { error, captchaURL });
                        } else {
                            const hashedPassword = data[0].password;
                            bcrypt.compare(password, hashedPassword)
                                .then(data => {
                                    if (data) {
                                        res.render('home');
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
    
}

module.exports = new LoginController;