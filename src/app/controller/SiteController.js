class SiteController {

    // [GET] /home
    home(req, res) {
        res.render('home');
    }

    notification(req, res) {
        res.render('notification', { message });
    }

    index(req, res) {
        if (req.session.user) {
            res.render('home');
        } else {
            res.render('introduction');
        }
    }

}

module.exports = new SiteController;