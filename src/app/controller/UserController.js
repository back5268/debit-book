// env variables
require('dotenv').config();

// MongoDB user
const User = require('../models/User');
const UserVertifycation = require('../models/UserVertifycation');
const PasswordReset = require('../models/PasswordReset');

// Password handle
const bcrypt = require('bcrypt');

// Email handler
const nodemailer = require('nodemailer');

// Unique string
const { v4: uuidv4 } = require('uuid');

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

const sendVertifycationEmail = ({ _id, email }, res) => {

    // Url to be used in the email
    const currentUrl = 'http://localhost:3000/';
    const uniqueString = uuidv4() + _id;

    // Mail content
    const mailOptions = {
        from: process.env.AUTH_EMAIL,
        to: email,
        subject: '[Thông báo] - Kích hoạt tài khoản!',
        html: `<p>Bạn hoặc ai đó đã sử dụng email: <h5>${email}</h5> để tạo tài khoản!</p> <br/>
            <p>Vui lòng truy cập đường dẫn: <a href=${currentUrl + "verify/" + _id + "/" + uniqueString}>
            ${currentUrl + "verify/" + _id + "/" + uniqueString}</a> để kích hoạt tài khoản.</p> <br/>
            <p> Lưu ý: Đường link chỉ được sử dụng 01 lần và có <h5>thời hạn trong 24 giờ</h5>.</p>
            <p>Sau thời gian trên hãy sử dụng chức năng quên mật khẩu để tiến hành tạo mới mật khẩu và kích hoạt tài khoản.</p>
            <p>Trân trọng cảm ơn,</p> <br/> <br/> <h5>------------------------------</h5> <br/>
            <span>Thanks and best regards, <br/>Development</span>`
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

// Sent password reset email
const senResetEmail = ({ _id, email }, redirectUrl, res) => {
    const resetString = uuidv4() + _id;

    // Clear all existing records
    PasswordReset.deleteMany({ userId: _id })
        .then(() => {
            const mailOptions = {
                from: process.env.AUTH_EMAIL,
                to: email,
                subject: '[Thông báo] - Lấy lại mật khẩu!',
                html: `<p>Bạn hoặc ai đó đã sử dụng email: <h5>${email}</h5> để gửi yêu cầu lấy lại mật khẩu đăng nhập!</p> <br/>
                    <p>Vui lòng truy cập đường dẫn: <a href=${redirectUrl + "/" + _id + "/" + resetString}>
                    ${redirectUrl + "/" + _id + "/" + resetString}</a> để xác nhận yêu cầu.</p> <br/>
                    <p> Lưu ý: Đường link chỉ được sử dụng 01 lần và có <h5>thời hạn trong 24 giờ</h5>.</p>
                    <p>Sau thời gian trên yêu cầu sẽ bị xóa và bạn không thể truy cập để lấy lại mật khẩu</p>
                    <p>Trân trọng cảm ơn,</p> <br/> <br/> <h5>------------------------------</h5> <br/>
                    <span>Thanks and best regards, <br/>Development</span>`
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
                                    res.json({
                                        status: "Email đã được gửi!",
                                        message: "Vui lòng kiểm tra hộp thư để xác nhận yêu cầu!"
                                    })
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

class UserController {

    resetPassword(req, res) {
        let { userId, resetString, newPassword } = req.body;
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
                                    bcrypt.hash(newPassword, saltRounds)
                                        .then(data => {
                                            // Update user password
                                            User.updateOne({ _id: userId }, { password: data })
                                                .then(() => {
                                                    // Update complete 
                                                    PasswordReset.deleteOne({ userId })
                                                        .then(() => {
                                                            res.json({
                                                                status: 'SUCCESS',
                                                                message: 'ok'
                                                            })
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
    }

    passwordReset(req, res) {
        const { email, redirectUrl } = req.body;
        User.find({ email })
            .then(data => {
                if (data.length) {
                    if (!data[0].verified) {
                        res.json({
                            status: "Error",
                            message: "Tài khoản chưa được xác nhận!"
                        })
                    } else {
                        senResetEmail(data[0], redirectUrl, res);
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
    }

    verify(req, res) {
        let { userId, uniqueString } = req.params;
        UserVertifycation.find({ userId })
            .then(data => {
                if (data.length) {
                    const { expiresAt } = data[0];
                    const hashedUniqueString = data[0].uniqueString;

                    // Checking for expires uniqueString 
                    if (expiresAt < Date.now()) {
                        UserVertifycation.deleteOne({ userId })
                            .then(() => {
                                User.deleteOne({ _id: userId })
                                    .then(() => {
                                        let message = 'Liên kết đã hết hạn!';
                                        res.redirect(`/user/verified/error=true&message=${message}`);
                                    })
                                    .catch(err => {
                                        console.log(err);
                                        let message = 'Có lỗi khi xóa dữ liệu trong UserDB!';
                                        res.redirect(`/user/verified/error=true&message=${message}`);
                                    })
                            })
                            .catch(err => {
                                console.log(err);
                                let message = 'Có lỗi khi xóa dữ liệu trong UserVertifycationDB!';
                                res.redirect(`/user/verified/error=true&message=${message}`);
                            })
                    } else {
                        // Compare the hashed unique string
                        bcrypt.hash(uniqueString, hashedUniqueString)
                            .then(data => {
                                if (data) {
                                    User.updateOne({ _id: userId }, { verified: true })
                                        .then(() => {
                                            UserVertifycation.deleteOne({ userId })
                                                .then(() => {
                                                    res.send('ok');
                                                })
                                                .catch(err => {
                                                    console.log(err);
                                                    let message = 'Có lỗi khi xóa dữ liệu trong UserVertifycationDB!';
                                                    res.redirect(`/user/verified/error=true&message=${message}`);
                                                })
                                        })
                                        .catch(err => {
                                            console.log(err);
                                            let message = 'Có lỗi khi cập nhật dữ liệu trong UserDB!';
                                            res.redirect(`/user/verified/error=true&message=${message}`);
                                        })
                                } else {
                                    let message = 'UniqueString không hợp lệ!';
                                    res.redirect(`/user/verified/error=true&message=${message}`);
                                }
                            })
                            .catch(err => {
                                console.log(err);
                                let message = 'Có lỗi khi hash uniqueString!';
                                res.redirect(`/user/verified/error=true&message=${message}`);
                            })
                    }
                } else {
                    let message = 'Không tìm thấy dữ liệu người dùng cần xác minh!';
                    res.redirect(`/user/verified/error=true&message=${message}`);
                }
            })
            .catch(err => {
                console.log(err);
                let message = 'Có lỗi khi tìm kiếm thông tin người dùng cần xác minh!';
                res.redirect(`/user/verified/error=true&message=${message}`);
            })
    }

    verified(req, res) {
        res.sendFile();
    }

    signup(req, res) {
        let { name, email, password } = req.body;
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
    }

    // Login
    login(req, res) {
        let { email, password } = req.body;
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
                                        res.json({
                                            status: "SUCCESS",
                                            message: "Đăng nhập thành công!",
                                            data: data
                                        })
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
    }
}

module.exports = new UserController;