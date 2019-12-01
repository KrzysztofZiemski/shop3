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
        this.router.get('/user', this._getUser.bind(this));
        this.router.get('/', this._getAllUser.bind(this));
        this.router.post('/', this._addUser.bind(this));
        this.router.put('/password', this._changePassword.bind(this));
        this.router.delete('/:id', this._deleteUser.bind(this));
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
        this.users.addUser(user).then(response => {
            res.status(200).send('added user')
        })
            .catch(err => res.status(400).send('użytkownik już istnieje'))
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