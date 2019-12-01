const express = require('express');
const Product = require('../controllers/Products.js');
const Errors = require('../controllers/Errors.js');

const Config = require('../config.js')

class ApiRouter {
    constructor() {
        this.router = express.Router();
        this.routes();
        this.products = new Product();
        this.config = new Config();
    }
    // /server/api
    routes() {
        this.router.get('/', this._getAllProducts.bind(this));
        this.router.get('/:id', this._getProduct.bind(this));
        this.router.post('/', this._addProduct.bind(this));
        this.router.put('/:id', this._changeProduct.bind(this));
        this.router.delete('/:id', this._deleteProduct.bind(this));
    }

    _getAllProducts(req, res) {
        this.products.getAll()
            .then(response => {
                res.status(200).send(response);
            })
            .catch(err => new Errors(err, res))
    }

    _getProduct(req, res) {
        const id = req.params.id;
        this.products.getProduct(id)
            .then(response => {
                res.status(200).send(response)
            })
            .catch(err => new Errors(err, res))
    }
    //waruki dotyczące zmiennych przekazanych - może poprzez plik config?
    _addProduct(req, res) {
        const data = req.body;
        this.products.addProduct(data)
            .then(response => {
                res.status(200).send(response)
            })
            .catch(err => {
                console.log('weszlo???'); new Errors(err, res)
            })
    }


    _changeProduct(req, res) {
        const data = req.body;
        const id = req.params.id;
        this.products.changeProduct(id, data)
            .then(response => {
                res.status(200).send(response);
            })
            .catch(err => new Errors(err, res))
    }

    _deleteProduct(req, res) {
        const id = req.params.id;
        this.products.deleteProduct(id)
            .then(response => {
                res.status(200).send(response);
            })
            .catch(err => new Errors(err, res))
    }

}

module.exports = ApiRouter;