class FinancesController {

    show(req, res) {
        if (req.session.user) {
            const user = req.session.user;
            res.render('finance', { 
                user, title: 'Finance' 
            });
        } else {
            res.render('login');
        }
    }

}

module.exports = new FinancesController;