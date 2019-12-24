const express = require('express');
const Users = require('../controllers/users.js');
const AuthController = require('../controllers/authentication.js');

class AuthRouter {
    constructor() {
        this.router = express.Router();
        this.routes();
        this.users = new Users();
        this.auth = new AuthController();
        //na próbe

    }
    // /server/auth
    routes() {
        this.router.post('/', this._authentication.bind(this))
        this.router.put('/', this.refreshToken.bind(this))
    }

    refreshToken(req, res) {

    }
    async _authentication(req, res, next) {
        const response = await this.users.getUser(req.body.login);
        if (response.docs.length !== 1) res.status(400).send('błędne zapytanie do servera')
        if (req.body.password === undefined) res.status(400).send('błędne zapytanie do servera')
        const user = response.docs[0];
        const token = await this.auth.authorization(user, req.body.password);

        // res.json(token);
        res.cookie('token', token, { maxAge: 1000 * 60 * 60, httpOnly: true });
        res.status(200).send('ok')
    }
}
module.exports = AuthRouter;

