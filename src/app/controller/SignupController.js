require('dotenv').config();
const User = require('../models/User');
const UserVertifycation = require('../models/UserVertifycation');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const { v4: uuidv4 } = require('uuid');

// Nodemailer
let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.AUTH_EMAIL,
        pass: process.env.AUTH_PASS,
    }
})

const sendVertifycationEmail = ({ _id, email }, res) => {

    // Url to be used in the email
    const currentUrl = 'http://localhost:3000/';
    const uniqueString = uuidv4() + _id;

    // Mail content
    const mailOptions = {
        from: process.env.AUTH_EMAIL,
        to: email,
        subject: '[Thông báo] - Kích hoạt tài khoản!',
        html: `<p>Bạn hoặc ai đó đã sử dụng email: <b>${email}</b> để tạo tài khoản!</p>
            <p>Vui lòng truy cập vào đường dẫn: <a href=${currentUrl + "verify/" + _id + "/" + uniqueString}>
            ${currentUrl + "verify/" + _id + "/" + uniqueString}</a> để kích hoạt.</p> <br/>
            <p>Lưu ý: Đường link chỉ được sử dụng 01 lần và có <b>thời hạn trong 24 giờ.</b></p>
            <p>Sau thời gian trên hãy sử dụng chức năng quên mật khẩu để tiến hành tạo mới mật khẩu và kích hoạt tài khoản.</p>
            <p>Trân trọng cảm ơn,</p> <br/> <p>------------------------------------------------------------</p>
            <p>Thanks and best regards,</p> <p><i>Development</i></p>`
    };

    // Hash the uniqueString
    const saltRounds = 10;
    bcrypt.hash(uniqueString, saltRounds)
        .then(data => {

            // Crate newVertifycation
            const newVertifycation = UserVertifycation({
                userId: _id,
                uniqueString: data,
                createAt: Date.now(),
                expiresAt: Date.now() + 86400000,
            })

            // Save newVertifycation at DB
            newVertifycation.save()
                .then(() => {
                    transporter.sendMail(mailOptions)
                        .then(() => {
                            res.json({
                                status: "Email đã được gửi",
                                message: "Vui lòng kiểm tra hộp thư để xác nhận tài khoản!"
                            })
                        })
                        .catch(err => {
                            console.log(err);
                            res.json({
                                status: "Error",
                                message: "Gửi mail không thành công!"
                            })
                        })
                })
                .catch(err => {
                    console.log(err);
                    res.json({
                        status: "Error",
                        message: "Không thể lưu xác nhận email!"
                    })
                })
        })
        .catch((err) => {
            console.log(err);
            res.json({
                status: "Error",
                message: "Có lỗi khi hash uniqueString!"
            })
        })
}

class SignupController {

    signupGet(req, res) {
        const captchaURL = `/captcha`;
        res.render('signup', { captchaURL });
    }

    signupPost(req, res) {
        let { name, email, password, captcha } = req.body;
        if (captcha === req.session.captcha) {
            name = name.trim();
            email = email.trim();
            password = password.trim();

            if (name == "" || email == "" || password == "") {
                res.json({
                    status: "Error",
                    message: "Không có thông tin được nhập!"
                })
            } else {
                User.find({ email })
                    .then(data => {
                        if (data.length) {
                            res.json({
                                status: "Error",
                                message: "Tài khoản đã tồn tại!"
                            })
                        } else {
                            const saltRounds = 10;
                            bcrypt.hash(password, saltRounds)
                                .then(data => {
                                    const newUser = new User({
                                        name,
                                        email,
                                        password: data,
                                        verified: false,
                                    });
                                    newUser.save()
                                        .then(data => {
                                            sendVertifycationEmail(data, res);
                                        })
                                        .catch(() => {
                                            res.json({
                                                status: "Error",
                                                message: "Có lỗi khi lưu tài khoản mới!"
                                            })
                                        })
                                })
                                .catch(() => {
                                    res.json({
                                        status: "Error",
                                        message: "Có lỗi khi hash mật khẩu!"
                                    })
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
            const captchaURL = `/captcha`;
            res.render('signup', { captchaURL });
        }
    }

}

module.exports = new SignupController;