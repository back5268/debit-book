const captchaURL = `/captcha`;

class SiteController {

    notification(req, res) {
        res.render('notification', { message });
    }

    index(req, res) {
        if (req.session.user) {
            const user = req.session.user;
            res.render('home', { 
                user, title: 'Home' 
            });
        } else {
            res.render('login', { captchaURL });
        }
    }

}

module.exports = new SiteController;