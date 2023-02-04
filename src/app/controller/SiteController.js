class SiteController {

    // [GET] /home
    index(req, res) {
        res.render('home');
    }

    login(req, res) {
        const captchaURL = `/captcha`;
        res.render('login', { captchaURL });
    }

    signup(req, res) {
        const captchaURL = `/captcha`;
        res.render('signup', { captchaURL });
    }

}

module.exports = new SiteController;