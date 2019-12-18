const PouchDB = require('pouchdb');
PouchDB.plugin(require('pouchdb-find'));
const bcrypt = require('bcryptjs');

const Validate = require('../schema.js')

class Users {
    constructor() {
        this.db = new PouchDB('./db/users');
        this.validate = new Validate();
        this.hashRound = 13;
    }

    getAllUser() {
        return this.db.allDocs({ include_docs: true })
    }
    getUser(login) {
        return this.db.find({ selector: { login } })
            .then(response => {
                if (response.docs.length !== 1) throw Error()
                return response;
            }).catch(err => console.log(err))
    }

    async addUser(user) {
        try {
            const { login, password, mail } = user;
            const dataUser = { login, password, mail }
            const isExist = await this._isExist(login)
            const hash = await bcrypt.hashSync(password, this.hashRound);
            const userValidated = await this.validate.validateUser(user);
            return this.db.post({ ...userValidated })
        } catch (error) {
            throw new Error(error);
        }


    }
    async addPermission(login, permission) {
        const responseUser = await this.getUser(login);
        const user = responseUser.docs[0]
        return this.db.put({ ...user, permission })

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
            .then(response => { if (response.docs.length !== 0) new Error('użytkownik już istnieje'); })
            .catch(err => new Error(err))
    }
}


module.exports = Users;