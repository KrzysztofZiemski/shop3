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
        this.products = data.products;
        this.fulName = data.fulName;
        this.adress = data.adress;
        this.date = new Date();

    }
    async start() {
        let { products, fulName, adress, userId } = this;

        products = await this.getProductsById(products);
        const sumPrice = this.sumPrice(products);
        const date = new Date().toISOString().slice(0, 10);
        const data = {
            products, userId, fulName, adress, sumPrice, date
        }

        const validateTransaction = await this.validate.validateTransaction(data);

        if (!validateTransaction) return false

        const resultAddTransaciot = await this.transactions.add(validateTransaction)
            .catch(err => console.log(err))

        const summaryResponse = {
            idTransacion: resultAddTransaciot.id,
            buyedProducts: products,
            sumPrice: sumPrice
        }
        return summaryResponse

    }

    async getProductsById(products) {
        return Promise.all(products.map(async product => {
            const response = await this.api.getProduct(product.id);
            return {
                count: product.count,
                product: response
            }
        }))
    }

    sumPrice(arrProducts) {
        let sum = 0;
        arrProducts.forEach(product => {
            sum += Number(product.product.price) * Number(product.count);
        });

        return sum
    }

}

module.exports = Buy;