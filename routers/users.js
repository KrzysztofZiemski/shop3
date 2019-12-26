const express = require('express');
const Users = require('../controllers/users.js');
const AuthController = require('../controllers/authentication.js');

class UsersRouter {
    constructor() {
        this.auth = new AuthController();
        this.router = express.Router();
        this.routes();
        this.users = new Users();
    }

    // /server/users
    routes() {
        this.router.get('/:id', this.auth.checkAdminToken, this._getUser.bind(this));
        this.router.get('/', this.auth.checkAdminToken, this._getAllUser.bind(this));
        this.router.post('/', this._addUser.bind(this));
        this.router.put('/password', this.auth.checkAdminToken, this._changePassword.bind(this));
        this.router.put('/permission', this.auth.checkAdminToken, this._addPermission.bind(this));
        this.router.delete('/:id', this.auth.checkAdminToken, this._deleteUser.bind(this));
    }
    _addPermission(req, res) {
        //tutaj weryfikację i login
        const { login, permission } = req.body
        this.users.addPermission(login, permission)
            .then(response => res.status(200).send(`permission is changed to ${permission}`))
            .catch(err => res.status(500).send('error during change permission'))
    }
    _getUser(req, res) {
        const login = req.body.login;
        this.users.getUser(login)
            .then(response => res.status(200).send(response))
            .catch(err => res.status(400).send('znaleziono więcej niż jednego użytkownika pasującego do podanych kryteriów'))
    }
    _getAllUser(req, res) {
        this.users.getAllUser().then(response => {
            res.status(200).send(response)
        }).catch(err => {
            console.log('błąd pobrania użytkowników')
        })
    }
    _addUser(req, res) {

        const user = req.body;
        if (user.login === undefined || user.password === undefined || user.mail === undefined) return res.status(400).send('put required data');

        this.users.addUser(user)
            .then(result => {
                if (result === "exist") {
                    return res.status(400).json('Podany login już istnieje');
                }
                res.status(200).json('Dokonano rejestracji, zapraszamy do zalogowania')
            })
            .catch(err => res.status(500).json(err));
    }
    _changePassword(req, res) {
        const { login, password } = req.body
        if (login === undefined || password === undefined) res.status(400).json('hasło nie zostało zmienione')
        try {
            this.users.changePassword(login, password)
                .then(response => res.status(200).json('hasło zmienione'))
                .catch(err => res.status(err.status).json('hasło nie zostało zmienione'))
        } catch (e) {
            res.status(e).json('hasło nie zostało zmienione')
        }
    }

    _deleteUser(req, res) {
        const id = req.params.id
        this.users.deleteUser(id).then(response => res.status(200).send('użytkownik usunięty'))
            .catch(err => res.status(err.status).send(err))
    }
}

module.exports = UsersRouter;