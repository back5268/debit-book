class SystemController {

    show(req, res) {
        if (req.session.user) {
            const user = req.session.user;
            if (user.role === 0) {
                res.render('control', { 
                    user, title: 'Control' 
                });
            } else {
                res.render('home', { 
                    user, title: 'Home' 
                });
            }
        } else {
            res.render('login');
        }
    }

}

module.exports = new SystemController;