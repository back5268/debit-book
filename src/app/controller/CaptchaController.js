const svgCaptcha = require('svg-captcha');

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

    captcha(req, res) {
        const captcha = svgCaptcha.create();
        req.session.captcha = captcha.text;
        console.log(req.session.captcha);
        res.type('svg');
        res.status(200).send(captcha.data);
    }

    newCaptcha(req, res) {
        const captcha = generateCaptcha(req);
        res.json({ captcha });
    }

}

module.exports = new CaptchaController;