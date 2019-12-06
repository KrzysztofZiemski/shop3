const PouchDB = require('pouchdb');
PouchDB.plugin(require('pouchdb-find'));
const hash = require('object-hash');

const Validate = require('../schema.js')

class Users {
    constructor() {
        this.db = new PouchDB('./db/users');
        this.validate = new Validate();
    }

    getAllUser() {
        return this.db.allDocs({ include_docs: true })
    }
    getUser(login) {
        return this.db.find({ selector: { login } })
            .then(response => {
                if (response.docs.length !== 1) throw Error()
                return response;
            })
    }

    addUser(user) {
        const { login } = user;
        return this._isExist(login)
            .then(response => this.validate.validateUser(user))
            .then(userValidated => {
                user.password = hash(user.password)
                this.db.post({ ...user })
            })
    }

    changePassword(login, password) {
        return this.db.find({ selector: { login } })
            .then(userFinded => {
                if (userFinded.docs.length !== 1) throw Error('znaleziono więcej niż jednego użytkownika o podanych kryteriach');
                const user = userFinded.docs[0];
                this.db.put({ ...user, password })
            })
    }
    deleteUser(id) {
        return this.db.get(id)
            .then(user => this.db.remove(user))
    }


    _isExist(login) {
        return this.db.find({ selector: { login }, fields: ['_id'], })
            .then(response => {
                if (response.docs.length !== 0) throw Error('użytkownik już istnieje -b')
            })
    }
}


module.exports = Users;