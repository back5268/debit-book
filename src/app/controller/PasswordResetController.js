require('dotenv').config();
const User = require('../models/User');
const PasswordReset = require('../models/PasswordReset');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const { v4: uuidv4 } = require('uuid');
const currentUrl = 'http://localhost:3000/';
const captchaURL = `/captcha`;

const transporter = nodemailer.createTransport({
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
const senResetEmail = ({ _id, email, account }, res) => {
    const resetString = uuidv4() + _id;
    const error = 'noError';

    // Clear all existing records
    PasswordReset.deleteMany({ userId: _id })
        .then(() => {
            const mailOptions = {
                from: process.env.AUTH_EMAIL,
                to: email,
                subject: '[Thông báo] - Lấy lại mật khẩu!',
                html: `<p>Bạn hoặc ai đó đã sử dụng email: <b>${account}</b> để gửi yêu cầu lấy lại mật khẩu đăng nhập!</p>
                    <p>Vui lòng truy cập đường dẫn: <a href=${currentUrl + "resetPassword/" + _id + "/" + resetString + "/" + email + "/" + account + "/" + error}>
                    ${currentUrl + "resetPassword/" + _id + "/" + resetString + "/"}</a> để xác nhận yêu cầu.</p> <br/>
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
                                    const message = 'Yêu cầu lấy lại mật khẩu đã được gửi. Vui lòng kiểm tra email để xác nhận!';
                                    res.render('notification', { message });
                                })
                                .catch(err => {
                                    console.log(err)
                                    const message = 'Gửi mail xác nhận không thành công!';
                                    res.render('notification', { message });
                                })
                        })
                        .catch(err => {
                            console.log(err)
                            const message = 'Không thể lưu dữ liệu!';
                            res.render('notification', { message });
                        })
                })
                .catch(err => {
                    console.log(err);
                    const message = 'Có lỗi xảy ra khi hash resetString!';
                    res.render('notification', { message });
                })
        })
        .catch(err => {
            console.log(err);
            const message = 'Có lỗi xảy ra khi xóa dữ liệu PasswordResetDB!';
            res.render('notification', { message });
        })
}

class PasswordResetController {

    resetPassword(req, res) {
        let { userId, resetString, password, captcha, email } = req.body;
        if (captcha == req.session.captcha) {
            PasswordReset.find({ userId })
                .then(data => {
                    if (data.length > 0) {

                        // password reset record exist so we proceed
                        const { expiresAt } = data[0];
                        const hashedResetString = data[0].resetString;

                        if (expiresAt < Date.now()) {
                            PasswordReset.deleteOne({ userId })
                                .then(() => {
                                    const message = 'Yêu cầu lấy lại mật khẩu đã hết hạn!';
                                    res.render('notification', { message });
                                })
                                .catch(err => {
                                    console.log(err);
                                    const message = 'Xóa dữ liệu không thành công!';
                                    res.render('notification', { message });
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
                                                                const message = 'Đổi mật khẩu thành công!';
                                                                res.render('notification', { message });
                                                            })
                                                            .catch(err => {
                                                                console.log(err);
                                                                const message = 'Xóa dữ liệu không thành công!';
                                                                res.render('notification', { message });
                                                            })
                                                    })
                                                    .catch(err => {
                                                        console.log(err);
                                                        const message = 'Cập nhật mật khẩu mới không thành công!';
                                                        res.render('notification', { message });
                                                    })
                                            })
                                            .catch(err => {
                                                console.log(err);
                                                const message = 'Hash pasword không thành công!';
                                                res.render('notification', { message });
                                            })
                                    } else {
                                        const message = 'ResetString không đúng!';
                                        res.render('notification', { message });
                                    }
                                })
                                .catch(err => {
                                    console.log(err);
                                    const message = 'ResetString không đúng!';
                                    res.render('notification', { message });
                                })
                        }
                    } else {
                        const message = 'Không tìm thấy userId!';
                        res.render('notification', { message });
                    }
                })
                .catch(err => {
                    console.log(err);
                    const message = 'Có lỗi xảy ra khi tìm kiếm thông tin người dùng!';
                    res.render('notification', { message });
                })
        } else {
            const error = 'Mã captcha không đúng!';
            res.redirect(`${currentUrl + "resetPassword/" + userId + "/" + resetString + "/" + email + "/" + error}`);
        }

    }

    getReset(req, res) {
        let { userId, resetString, email, account, error } = req.params;
        if (error === 'noError') error = '';
        res.render('resetPassword', { userId, resetString, email, account, error, captchaURL });
    }

    passwordrr(req, res) {
        const { email, account, captcha } = req.body;
        if (captcha == req.session.captcha) {
            User.find({ email, account })
                .then(data => {
                    if (data.length) {
                        if (!data[0].verified) {
                            const error = 'Tài khoản chưa được xác nhận!';
                            res.render('passwordrr', { error, captchaURL });
                        } else {
                            senResetEmail(data[0], res);
                        }
                    } else {
                        const error = 'Tài khoản không tồn tại!';
                        res.render('passwordrr', { error, captchaURL });
                    }
                })
                .catch(err => {
                    console.log(err);
                    const message = 'Có lỗi khi tìm kiếm thông tin người dùng!';
                    res.render('notification', { message });
                })
        } else {
            const error = 'Mã captcha không đúng!';
            res.render('passwordrr', { error, captchaURL });
        }
    }

    getRequest(req, res) {
        res.render('passwordrr', { captchaURL });
    }

}

module.exports = new PasswordResetController;