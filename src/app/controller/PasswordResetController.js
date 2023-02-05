// env variables
require('dotenv').config();

// MongoDB user
const User = require('../models/User');
const PasswordReset = require('../models/PasswordReset');

// Password handle
const bcrypt = require('bcrypt');

// Email handler
const nodemailer = require('nodemailer');

// Unique string
const { v4: uuidv4 } = require('uuid');

const currentUrl = 'http://localhost:3000/';

// Nodemailer
let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.AUTH_EMAIL,
        pass: process.env.AUTH_PASS,
    }
})

// Test nodemailer
transporter.verify((err, success) => {
    if (err) {
        console.log('Connect to nodemailer Failed!');
    } else {
        console.log('Connect to nodemailer successfully!');
    }
})

// Sent password reset email
const senResetEmail = ({ _id, email }, res) => {

    const resetString = uuidv4() + _id;

    // Clear all existing records
    PasswordReset.deleteMany({ userId: _id })
        .then(() => {
            const mailOptions = {
                from: process.env.AUTH_EMAIL,
                to: email,
                subject: '[Thông báo] - Lấy lại mật khẩu!',
                html: `<p>Bạn hoặc ai đó đã sử dụng email: <b>${email}</b> để gửi yêu cầu lấy lại mật khẩu đăng nhập!</p>
                    <p>Vui lòng truy cập đường dẫn: <a href=${currentUrl + "resetPassword/" + _id + "/" + resetString}>
                    ${currentUrl + "resetPassword/" + _id + "/" + resetString}</a> để xác nhận yêu cầu.</p> <br/>
                    <p>Lưu ý: Đường link chỉ được sử dụng 01 lần và có <b>thời hạn trong 24 giờ.</b></p>
                    <p>Sau thời gian trên sẽ không thể truy cập để thực hiện yêu cầu lấy lại mật khẩu.</p>
                    <p>Trân trọng cảm ơn,</p> <br/> <p>------------------------------------------------------------</p>
                    <p>Thanks and best regards,</p> <p><i>Development</i></p>`
            };

            // Hash the reset String
            const saltRounds = 10;
            bcrypt.hash(resetString, saltRounds)
                .then(data => {
                    const newPasswordReset = new PasswordReset({
                        userId: _id,
                        resetString: data,
                        createAt: Date.now(),
                        expiresAt: Date.now() + 86400000,
                    })

                    newPasswordReset.save()
                        .then(() => {
                            transporter.sendMail(mailOptions)
                                .then(() => {
                                    let message = 'Yêu cầu lấy lại mật khẩu đã được gửi. Vui lòng kiểm tra email để xác nhận!';
                                    res.render('verified', { message });
                                })
                                .catch(err => {
                                    console.log(err)
                                    res.json({
                                        status: "Error",
                                        message: "Gửi mail xác nhận không thành công!"
                                    })
                                })
                        })
                        .catch(err => {
                            console.log(err)
                            res.json({
                                status: "Error",
                                message: "Không thể lưu dữ liệu lấy lại mật khẩu!"
                            })
                        })
                })
                .catch(err => {
                    console.log(err);
                    res.json({
                        status: "Error",
                        message: "Có lỗi khi hash resetString!"
                    })
                })
        })
        .catch(err => {
            console.log(err);
            res.json({
                status: "Error",
                message: "Có lỗi khi xóa yêu cầu lấy lại mật khẩu hết hạn!"
            })
        })
}

class PasswordResetController {

    resetPassword(req, res) {
        let { userId, resetString, password, captcha } = req.body;
        if (captcha === req.session.captcha) {
            PasswordReset.find({ userId })
                .then(data => {
                    if (data.length > 0) {

                        // password reset record exist so we proceed
                        const { expiresAt } = data[0];
                        const hashedResetString = data[0].resetString;

                        if (expiresAt < Date.now()) {
                            PasswordReset.deleteOne({ userId })
                                .then(() => {
                                    res.json({
                                        status: "Error",
                                        message: "Yêu cầu lấy lại mật khẩu đã hết hạn!"
                                    })
                                })
                                .catch(err => {
                                    console.log(err);
                                    res.json({
                                        status: "Error",
                                        message: "Xóa dữ liệu trong PasswordReset không thành công!"
                                    })
                                })
                        } else {
                            // Compare resetString
                            bcrypt.compare(resetString, hashedResetString)
                                .then(data => {
                                    if (data) {
                                        // Hash password again
                                        const saltRounds = 10;
                                        bcrypt.hash(password, saltRounds)
                                            .then(data => {
                                                // Update user password
                                                User.updateOne({ _id: userId }, { password: data })
                                                    .then(() => {
                                                        // Update complete 
                                                        PasswordReset.deleteOne({ userId })
                                                            .then(() => {
                                                                let message = 'Đổi mật khẩu thành công!';
                                                                res.render('verified', { message });
                                                            })
                                                            .catch(err => {
                                                                console.log(err);
                                                                res.json({
                                                                    status: "Error",
                                                                    message: "Xóa dữ liệu trong PasswordReset không thành công!"
                                                                })
                                                            })
                                                    })
                                                    .catch(err => {
                                                        console.log(err);
                                                        res.json({
                                                            status: "Error",
                                                            message: "Cập nhật mật khẩu mới không thành công!"
                                                        })
                                                    })
                                            })
                                            .catch(err => {
                                                console.log(err);
                                                res.json({
                                                    status: "Error",
                                                    message: "Hash password không thành công!"
                                                })
                                            })
                                    } else {
                                        res.json({
                                            status: "Error",
                                            message: "ResetString không hợp lệ!"
                                        })
                                    }
                                })
                                .catch(err => {
                                    console.log(err);
                                    res.json({
                                        status: "Error",
                                        message: "ResetString không hợp lệ!"
                                    })
                                })
                        }
                    } else {
                        res.json({
                            status: "Error",
                            message: "Không tìm thấy userId!"
                        })
                    }
                })
                .catch(err => {
                    console.log(err);
                    res.json({
                        status: "Error",
                        message: "Có lỗi khi tìm thông tin người dùng trong DB!"
                    })
                })
        } else {
            res.redirect(`${currentUrl + "resetPassword/" + userId + "/" + resetString}`);
        }

    }

    getReset(req, res) {
        let { userId, resetString } = req.params;
        const captchaURL = `/captcha`;
        res.render('resetPassword', { captchaURL, userId, resetString });
    }

    passwordrr(req, res) {
        const { email, captcha } = req.body;
        if (captcha === req.session.captcha) {
            User.find({ email })
                .then(data => {
                    if (data.length) {
                        if (!data[0].verified) {
                            res.json({
                                status: "Error",
                                message: "Tài khoản chưa được xác nhận!"
                            })
                        } else {
                            senResetEmail(data[0], res);
                        }
                    } else {
                        res.json({
                            status: "Error",
                            message: "Tài khoản không tồn tại!"
                        })
                    }
                })
                .catch(err => {
                    console.log(err);
                    res.json({
                        status: "Error",
                        message: "Có lỗi khi tìm thông tin người dùng trong DB!"
                    })
                })
        } else {
            const captchaURL = `/captcha`;
            res.render('passwordrr', { captchaURL });
        }

    }

    getRequest(req, res) {
        const captchaURL = `/captcha`;
        res.render('passwordrr', { captchaURL });
    }

}

module.exports = new PasswordResetController;