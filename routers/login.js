const express = require('express');

class LoginRouter {
    constructor() {
        this.router = express.Router();
        this.routes();
    }
    // /server/login
    routes() {
        this.router.get('/', this._login.bind(this))
    }


    _login(req, res, next) {
        const { login, password } = req.body;
        console.log(login, password);
    }
}

module.exports = LoginRouter;

const bodyParser = require('body-parser');


//z poprzedniego projektu
// if (!isCorrectPassword) return res.redirect('/login/incorrect')//do dopracowania zwrot falsa, z res body, aby login i hasło. Nie dziala równeiż redirect jak przez fetcha robie - sprawdź
//         req.session.admin = 1;
//         res.redirect('/admin')
// req.session.admin = 1;
//         res.redirect('/admin')