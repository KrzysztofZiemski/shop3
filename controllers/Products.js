const PouchDB = require('pouchdb');
PouchDB.plugin(require('pouchdb-find'));

const Validate = require('../schema');

class Product {
    constructor() {
        this.db = new PouchDB('./db/products');
        this.validate = new Validate();
    }

    getAll() {
        return this.db.allDocs({ include_docs: true });
    }

    getProduct(id) {
        return this.db.get(id)
    }

    //warunki zapytania
    addProduct(data) {
        return this._validate(data)
            .then(response => this.db.post(
                { ...response }
            ))
    }
    changeProduct(id, data) {
        return this.getProduct(id)
            .then(product => this._updateProduct(product, data))
    }
    _updateProduct(product, data) {
        console.log(product)
        console.log(data)
        return this.db.put({ ...product, ...data })
    }
    deleteProduct(id) {
        return this.getProduct(id).then(product => this.db.remove(product))
    }
    _validate(data) {
        return this.validate.validateProduct(data)
    }

}

module.exports = Product;
