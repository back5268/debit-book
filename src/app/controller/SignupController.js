require('dotenv').config();
const User = require('../models/User');
const UserVertification = require('../models/UserVertification');
const { addEmailToQueue, sendEmails } = require('../../util/emailQueue');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const currentUrl = process.env.CURRENT_URL;

sendEmails();

// Function to add email message to queue
function sendVerification({ _id, email, account }, uniqueString) {
    const mailOptions = {
        from: process.env.AUTH_EMAIL,
        to: email,
        subject: '[Thông báo] - Kích hoạt tài khoản!',
        html: `<p>Bạn hoặc ai đó đã sử dụng email để tạo tài khoản: <b>${account}</b>!</p>
            <p>Vui lòng truy cập vào đường dẫn: <a href=${currentUrl + "verify/" + _id + "/" + uniqueString}>
            active account</a> để kích hoạt.</p> <br/>
            <p>Lưu ý: Đường link chỉ được sử dụng 01 lần và có <b>thời hạn trong 24 giờ.</b></p>
            <p>Sau thời gian trên hãy sử dụng chức năng quên mật khẩu để tiến hành tạo mới mật khẩu và kích hoạt tài khoản.</p>
            <p>Trân trọng cảm ơn,</p> <br/> <p>------------------------------------------------------------</p>
            <p>Thanks and best regards,</p> <p><i>Development</i></p>`
    };
    addEmailToQueue(mailOptions);
};

class SignupController {

    // [GET] /signup
    signupGet(req, res) {
        res.render('form/signup');
    }

    // [POST] /signup
    signupPost(req, res) {
        let { email, account, password, captcha } = req.body;
        if (captcha == req.session.captcha) {
            email = email.trim();
            account = account.trim();
            password = password.trim();

            if (email == '' || account == '' || password == '') {
                res.status(403).json({ message: 'Empty input fields!' });
            } else if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
                res.status(403).json({ message: 'Invalid email entered!' });
            } else if (password.length < 6) {
                res.status(403).json({ message: 'Password is too short!' });
            } else {
                User.find({ account })
                    .then(data => {
                        if (data.length) {
                            res.status(403).json({ message: 'Tài khoản đã tồn tại!' });
                        } else {
                            const saltRounds = 10;
                            bcrypt.hash(password, saltRounds)
                                .then(data => {
                                    const newUser = new User({
                                        fullname: '',
                                        email,
                                        account,
                                        password: data,
                                        verified: false,
                                        phone: '',
                                        address: '',
                                        description: '',
                                        role: 1,
                                        createAt: Date.now(),
                                    });
                                    newUser.save()
                                        .then(data => {
                                            let user = data;
                                            const uniqueString = uuidv4() + user._id;
                                            const saltRounds = 10;
                                            bcrypt.hash(uniqueString, saltRounds)
                                                .then(data => {
                                                    const newVertification = UserVertification({
                                                        userId: user._id,
                                                        userAccount: user.account,
                                                        uniqueString: data,
                                                        createAt: Date.now(),
                                                        expiresAt: Date.now() + 86400000,
                                                    })
                                                    newVertification.save()
                                                        .then(() => {
                                                            sendVerification(user, uniqueString, res);
                                                            res.json({ message: 'Yêu cầu đã được gửi, vui lòng kiểm tra gmail!' });
                                                        })
                                                        .catch(err => {
                                                            console.log(err);
                                                            res.status(403).json({ message: 'Gửi mail không thành công!' });
                                                        })
                                                })
                                                .catch(err => {
                                                    console.log(err);
                                                    res.status(403).json({ message: 'Gửi mail không thành công!' });
                                                })

                                            sendVerification(data, res);
                                        })
                                        .catch(err => {
                                            console.log(err);
                                            res.status(403).json({ message: 'Tài khoản của bạn không thể xác nhận!' });
                                        })
                                })
                                .catch(err => {
                                    console.log(err);
                                    res.status(403).json({ message: 'Tài khoản của bạn không thể xác nhận!' });
                                })
                        }
                    })
                    .catch(err => {
                        console.log(err);
                        res.status(403).json({ message: 'Tài khoản của bạn không thể xác nhận!' });
                    })
            }
        } else {
            res.status(403).json({ message: 'Mã captcha không đúng!' });
        }
    }

}

module.exports = new SignupController;