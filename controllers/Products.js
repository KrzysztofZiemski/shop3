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
            .then(response => {
                console.log(response)
                this.db.post(
                    { ...response }
                )
            })
    }
    changeProduct(id, data) {
        return this.getProduct(id)
            .then(product => this._updateProduct(product, data))
    }
    _updateProduct(product, data) {
        return this.db.put({ ...product, ...data })
    }
    deleteProduct(id) {
        return this.getProduct(id).then(product => this.db.remove(product))
    }
    _validate(data) {
        return this.validate.validateProduct(data)
    }
    // _isExist(name) {
    //     return this.db.find({ selector: { name } })
    //         .then(response => {
    //             console.log(response.docs.length)
    //             if (response.docs.length !== 0) throw Error('produkt już istnieje')
    //             return response;
    //         })
    // }
}

module.exports = Product;
