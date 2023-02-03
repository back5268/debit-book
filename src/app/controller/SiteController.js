class SiteController {

    // [GET] /home
    index(req, res) {
        res.render('home');
    }

    login(req, res) {
        res.send(`<form action="" method="post">
    <input type="text" name="email"> <br>
    <input type="text" name="password"> <br>
    <button type="submit">Signup</button>
</form>
    `);
    }

    signup(req, res) {
        res.send(`<form action="" method="post">
    <input type="text" name="name"> <br>
    <input type="text" name="email"> <br>
    <input type="text" name="password"> <br>
    <button type="submit">Signup</button>
</form>
    `);
    }

}

module.exports = new SiteController;