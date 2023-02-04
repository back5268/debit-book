const User = require('../models/User');
const UserVertifycation = require('../models/UserVertifycation');
const bcrypt = require('bcrypt');

class VerifycationController {

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

}

module.exports = new VerifycationController;