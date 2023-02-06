const User = require('../models/User');
const UserVeritification = require('../models/UserVertification');
const bcrypt = require('bcrypt');

class VerificationController {

    verify(req, res) {
        let { userId, uniqueString } = req.params;
        UserVeritification.find({ userId })
            .then(data => {
                if (data.length) {
                    const { expiresAt } = data[0];
                    const hashedUniqueString = data[0].uniqueString;

                    // Checking for expires uniqueString 
                    if (expiresAt < Date.now()) {
                        UserVeritification.deleteOne({ userId })
                            .then(() => {
                                User.deleteOne({ _id: userId })
                                    .then(() => {
                                        const message = 'Liên kết đã hết hạn!';
                                        res.render('notification', { message });
                                    })
                                    .catch(err => {
                                        console.log(err);
                                        const message = 'Có lỗi khi xóa dữ liệu!';
                                        res.render('notification', { message });
                                    })
                            })
                            .catch(err => {
                                console.log(err);
                                const message = 'Có lỗi khi xóa dữ liệu!';
                                res.render('notification', { message });
                            })
                    } else {
                        // Compare the hashed unique string
                        bcrypt.hash(uniqueString, hashedUniqueString)
                            .then(data => {
                                if (data) {
                                    User.updateOne({ _id: userId }, { verified: true })
                                        .then(() => {
                                            UserVeritification.deleteOne({ userId })
                                                .then(() => {
                                                    const message = 'Tài khoản của bạn đã được kích hoạt thành công!';
                                                    res.render('notification', { message });
                                                })
                                                .catch(err => {
                                                    console.log(err);
                                                    const message = 'Có lỗi khi xóa dữ liệu!';
                                                    res.render('notification', { message });
                                                })
                                        })
                                        .catch(err => {
                                            console.log(err);
                                            const message = 'Có lỗi khi cập nhật dữ liệu!';
                                            res.render('notification', { message });
                                        })
                                } else {
                                    const message = 'Mã xác nhận không đúng!';
                                    res.render('notification', { message });
                                }
                            })
                            .catch(err => {
                                console.log(err);
                                const message = 'Có lỗi khi so sánh uniqueString!';
                                res.render('notification', { message });
                            })
                    }
                } else {
                    const message = 'Không tìm thấy dữ liệu người dùng cần xác minh!';
                    res.render('notification', { message });
                }
            })
            .catch(err => {
                console.log(err);
                const message = 'Không tìm thấy dữ liệu người dùng cần xác minh!';
                res.render('notification', { message });
            })
    }

}

module.exports = new VerificationController;