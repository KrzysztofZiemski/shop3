const PouchDB = require('pouchdb');
PouchDB.plugin(require('pouchdb-find'));
const path = require('path');
const fs = require('fs');

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
                this.db.post(
                    { ...response }
                )
            })
    }
    async changeProduct(id, data) {
        const product = await this.getProduct(id);
        data['image'] = `http://localhost:3000/img/products/${req.body.name}.png`;
        if (data.name !== product.name) {
            const pathImg = path.join(__dirname, `../public/img/products/${product.name}.png`);
            try {
                fs.unlinkSync(pathImg, (err) => console.log("błąd podczas usuwania pliku"))
            } catch{
                console.log('błąd podczas usuwania pliku')
            }
        }
        return this._updateProduct(product, data);
    }
    _updateProduct(product, data) {
        return this.db.put({ ...product, ...data })
    }
    async deleteProduct(id) {
        const product = await this.getProduct(id)

        const pathImg = path.join(__dirname, `../public/img/products/${product.name}.png`);
        try {
            fs.unlinkSync(pathImg, (err) => console.log("błąd podczas usuwania pliku"))
        } catch{
            console.log('błąd podczas usuwania pliku')
        }
        return this.db.remove(product)
    }
    searchProduct(name) {
        return this.db.find({
            selector: { name },
            fields: ['name']
        })
            .then(response => { console.log(response); response.docs.length === 0 ? false : true });
    }
    _validate(data) {
        return this.validate.validateProduct(data)
    }
}

module.exports = Product;
