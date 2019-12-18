const express = require('express');
const Users = require('../controllers/users.js');

class UsersRouter {
    constructor() {
        this.router = express.Router();
        this.routes();
        this.users = new Users();
    }

    // /server/users
    routes() {
        this.router.get('/:id', this._getUser.bind(this));
        this.router.get('/', this._getAllUser.bind(this));
        this.router.post('/', this._addUser.bind(this));
        this.router.put('/password', this._changePassword.bind(this));
        this.router.put('/permission', this._addPermission.bind(this));
        this.router.delete('/:id', this._deleteUser.bind(this));
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
    async _addUser(req, res) {
        const user = req.body;
        if (user.login === undefined || user.password === undefined || user.mail === undefined) {
            res.status(400).send('put required data');
            return;
        }
        const isOk = await this.users.addUser(user);
        if (isOk.ok) {
            res.status(200).send('succesed add users');
            return
        };
        res.status(500).send('error during add user')
    }
    _changePassword(req, res) {
        const { login, newPassword } = req.body
        this.users.changePassword(login, newPassword)
            .then(response => res.status(200).send('hasło zmienione'))
            .catch(err => res.status(err.status).send('hasło nie zostało zmienione'))
    }

    _deleteUser(req, res) {
        const id = req.params.id
        this.users.deleteUser(id).then(response => res.status(200).send('użytkownik usunięty'))
            .catch(err => res.status(err.status).send(err))
    }
}

module.exports = UsersRouter;