const PouchDB = require('pouchdb');
PouchDB.plugin(require('pouchdb-find'));
const bcrypt = require('bcryptjs');

const Validate = require('../schema.js');

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
                if (response.docs.length !== 1) throw new Error();
                return
            }).catch(err => console.log(err))
    }

    async addUser(user) {
        const isExist = await this._isExist(user.login)
        if (isExist) {
            return 'exist'
        }
        user.password = await bcrypt.hashSync(user.password, this.validate.hashRound);
        const userValidated = await this.validate.validateUser(user);
        return this.db.post({ ...userValidated })
    }


    async addPermission(login, permission) {
        const responseUser = await this.getUser(login);
        const user = responseUser.docs[0]
        return this.db.put({ ...user, permission })

    }
    async changePassword(login, newPassword) {
        const response = await this.db.find({ selector: { login } });
        if (response.docs.length !== 1) {
            throw Error('znaleziono więcej niż jednego użytkownika o podanych kryteriach');
        }
        const user = response.docs[0];
        const password = await bcrypt.hashSync(newPassword, this.hashRound);
        return this.db.put({ ...user, password });
    }
    deleteUser(id) {
        return this.db.get(id)
            .then(user => this.db.remove(user))
    }


    _isExist(login) {

        return this.db.find({ selector: { login }, fields: ['_id'], })
            .then(response => {
                if (response.docs.length !== 0) return true;
                return false;
            })
            .catch(err => new Error(err))
    }
}


module.exports = Users;