const User = require('../models/User');
const bcrypt = require('bcrypt');

class LoginController {

    loginGet(req, res) {
        const captchaURL = `/captcha`;
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
                            let message = 'Tài khoản chưa được xác minh. Vui lòng kiểm tra emai!';
                            res.render('verified', { message });
                        } else {
                            const hashedPassword = data[0].password;
                            bcrypt.compare(password, hashedPassword)
                                .then(data => {
                                    if (data) {
                                        res.render('home');
                                    } else {
                                        let message = 'Mật khẩu không chính xác!';
                                        res.render('verified', { message });
                                    }
                                })
                                .catch(err => {
                                    console.log('Có lỗi khi kiểm tra mật khẩu!')
                                    console.log(err);
                                })
                        }
                    } else {
                        let message = 'Tài khoản không tồn tại!';
                        res.render('verified', { message });
                    }
                })
                .catch((err) => {
                    console.log('Có lỗi khi kiểm tra email!');
                    console.log(err);
                })

        } else {
            res.render('login');
        }
    }
}

module.exports = new LoginController;