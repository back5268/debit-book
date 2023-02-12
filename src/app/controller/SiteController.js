const captchaURL = `/captcha`;

class SiteController {

    notification(req, res) {
        res.render('notification', { message });
    }

    index(req, res) {
        if (req.session.user) {
            const user = req.session.user;
            res.render('profile', { 
                user, title: 'Profile' 
            });
        } else {
            res.render('login', { captchaURL });
        }
    }

    showProfile(req, res) {
        res.render('profile')
    }

}

module.exports = new SiteController;