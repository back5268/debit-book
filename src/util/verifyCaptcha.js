const Captcha = require('../app/models/Captcha');

module.exports = {
    verifyCaptcha: function (captcha, callback) {
        Captcha.findOne({ captcha }, function (err, result) {
            if (err) {
                callback(err); // nếu có lỗi
            } else if (!result) {
                callback(null, false); // nếu không tìm thấy captcha, gọi lại hàm callback với tham số false
            } else {
                callback(null, true); // nếu tìm thấy captcha, gọi lại hàm callback với tham số true
            }
        });
    }
}