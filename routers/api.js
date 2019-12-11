const express = require('express');
const Product = require('../controllers/products.js');
const Errors = require('../controllers/errors.js');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
//i must move this to class, nie działa filtr rodzaju/////////////////////////////////////////
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/img/');
    },
    filename: function (req, file, cb) {
        cb(null, `${req.body.name}.png`);
    }
})
// const fileFilter = (req, file, cb) => {
//     if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
//         cb(null, true);
//     } else {
//         cb(null, false);
//     }
// }

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 10//10MB
    },
    // fileFilter: filefilter
});

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
        this.router.post('/', upload.single('image'), this._addProduct.bind(this));
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
    _addProduct(req, res, next) {
        const data = req.body;
        data['image'] = `http://localhost:3000/img/${req.body.name}.png`;
        console.log(data)
        this.products.addProduct(data)
            .then(response => {
                res.status(200).send(response)
            })
            .catch(err => {
                console.log('błąd dodawania???'); new Errors(err, res)
            })
    }


    _changeProduct(req, res) {
        const data = req.body;
        const id = req.params.id;
        console.log(req.body)
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