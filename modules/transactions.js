const express = require('express');
const Validate = require('../schema');
const Product = require('../controllers/products.js');
const Transactions = require('../controllers/transactions.js');

class Buy {
    constructor(data) {
        this.transactions = new Transactions();
        this.validate = new Validate();
        this.api = new Product()
        this.userId = data.userId;
        this.productsId = data.products;
        this.fulName = data.fulName;
        this.adress = data.adress;
        this.date = new Date();
        this.start()
    }
    async start() {
        const { productsId, fulName, adress, userId } = this
        const products = await this.getProductsById(productsId);

        const sumPrice = this.sumPrice(products)
        const date = new Date().toISOString().slice(0, 10);
        const data = {
            products, userId, fulName, adress, sumPrice, date
        }
        const validateTransaction = await this.validate.validateTransaction(data)
        if (!validateTransaction) return false
        this.transactions.add(validateTransaction).then(response => console.log(response)).catch(err => console.log(err))
    }

    async getProductsById(productsId) {
        return Promise.all(productsId.map(id => this.api.getProduct(id)));
    }

    sumPrice(arrProducts) {
        let sum = 0;
        arrProducts.forEach(product => {
            sum += Number(product.price);
        });
        return sum
    }

}

module.exports = Buy;