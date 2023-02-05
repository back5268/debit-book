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

            if (email == "" || password == "") {
                res.json({
                    status: "Error",
                    message: "Không có thông tin được nhập!"
                })
            } else {
                User.find({ email })
                    .then(data => {
                        if (data.length) {
                            if (!data[0].verified) {
                                res.json({
                                    status: "Error",
                                    message: "Tài khoản chưa được xác minh. Vui lòng kiểm tra email!"
                                })
                            } else {
                                const hashedPassword = data[0].password;
                                bcrypt.compare(password, hashedPassword)
                                    .then(data => {
                                        if (data) {
                                            res.render('home');
                                        } else {
                                            res.json({
                                                status: "Error",
                                                message: "Mật khẩu không chính xác!"
                                            })
                                        }
                                    })
                                    .catch(err => {
                                        console.log(err);
                                        res.json({
                                            status: "Error",
                                            message: "Có lỗi khi kiểm tra mật khẩu!"
                                        })
                                    })
                            }
                        } else {
                            res.json({
                                status: "Error",
                                message: "Tài khoản không tồn tại!"
                            })
                        }
                    })
                    .catch(() => {
                        res.json({
                            status: "Error",
                            message: "Có lỗi khi tìm kiếm email người dùng!"
                        })
                    })
            }
        } else {
            res.render('login');
        }
    }

}

module.exports = new LoginController;