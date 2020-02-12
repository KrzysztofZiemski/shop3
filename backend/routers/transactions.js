const express = require('express');
const TransacionController = require('../controllers/transactions.js');
const mailer = require('../modules/mailer');
const Buy = require('../modules/Buy.js');
const Users = require('../controllers/users.js');
const Product = require('../controllers/products.js');

class Transactions {
    constructor() {
        this.router = express.Router();
        this.transacions = new TransacionController();
        this.routes();
        this.user = new Users();
        this.products = new Product();
    }
    // /server/transactions
    routes() {
        this.router.get('/', this._getAll.bind(this))
        this.router.post('/buy', this._buy.bind(this));
    }
    _getAll(req, res) {
        this.transacions.getAll()
            .then(response => {
                res.status(200).json(response)
            }).catch(err => res.status(500).json(res))
    }
    async _buy(req, res) {

        try {
            const data = req.body;
            const buy = new Buy(data);

            const responseTransaction = await buy.start(res);
            if (!responseTransaction.idTransacion || !responseTransaction) return res.status(500).json('nie udało się dokonać zakupu - spróbuj później');
            if (data.userId !== "") {
                const user = await this.user.getUserById(data.userId);
                user.historyTransactions.push({ id: responseTransaction.idTransacion, products: responseTransaction.buyedProducts })
                this.user.addUserTransaction(user);
            }

            const responseProduct = await this.products.buy(responseTransaction.buyedProducts);
            //błąd mailera - zapewne przez g maila - zamienić na inną technologię
            // if (data.mail) mailer({ fullName: data.fulName, mail: data.mail, idTransaction: responseTransaction.idTransacion })

            res.status(200).json('successed transaction')
        } catch (err) {
            console.log(err)
        }
    }
}




module.exports = Transactions;