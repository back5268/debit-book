const captchaURL = `/captcha`;

class SiteController {

    // [GET] /home
    home(req, res) {
        if (req.session.userName) {
            const userName = req.session.userName;
            const userId = req.session.userId;
            res.render('home', { userId, userName });
        } else {
            res.render('login', { captchaURL });
        }
    }

    notification(req, res) {
        res.render('notification', { message });
    }

    index(req, res) {
        if (req.session.userName) {
            const userName = req.session.userName;
            const userId = req.session.userId;
            res.render('home', { userId, userName });
        } else {
            res.render('login', { captchaURL });
        }
    }

}

module.exports = new SiteController;