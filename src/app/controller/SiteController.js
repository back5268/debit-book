class SiteController {

    // [GET] /home
    index(req, res) {
        res.render('home');
    }

    notification(req, res) {
        res.render('notification', { message });
    }

}

module.exports = new SiteController;