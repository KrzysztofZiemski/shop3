const express = require('express');
const TransacionController = require('../controllers/transactions.js');

class Transactions {
    constructor() {
        this.router = express.Router();
        this.transacions = new TransacionController();
        this.routes();
    }
    // /transactions
    routes() {
        this.router.get('/', this._getAll.bind(this))
    }
    _getAll(req, res) {
        this.transacions.getAll()
            .then(response => {
                res.json(response)
            })
    }
}




module.exports = Transactions;