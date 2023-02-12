const svgCaptcha = require('svg-captcha');
const Captcha = require('../models/Captcha');

function generateCaptcha(req) {
    // Tạo mã captcha ngẫu nhiên
    const captcha = svgCaptcha.create({
        size: 4,
        ignoreChars: '0o1il',
        noise: 2,
        color: true
    });
    return captcha.data;
}

class CaptchaController {

    captcha(req, res, next) {
        const captcha = svgCaptcha.create();
        req.session.captcha = captcha.text;
        const newCaptcha = new Captcha({
            captcha: captcha.text,
            createAt: Date.now(),
            expiresAt: Date.now() + 300000,
        })
        Captcha.deleteMany({ expiresAt: { $lt: Date.now() } })
            .then(() => {
                console.log('Xóa captcha hết hạn thành công!');
            })
            .catch(next);

        newCaptcha.save()
            .then(() => {
                res.type('svg');
                res.status(200).send(captcha.data);
            })
            .catch(next);
    }

    newCaptcha(req, res) {
        const captcha = generateCaptcha(req);
        res.json({ captcha });
    }

}

module.exports = new CaptchaController;