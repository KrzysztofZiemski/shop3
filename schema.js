
class Validate {
    constructor() {
        this.tags = ['niebieski', 'czarny', 'różowy', 'pomarańczowy', 'srebrny', 'czerwony', 'czerwnoy'];
        this.statuses = ['accepted', 'waiting payment', 'in progress', 'sent', 'closed', 'canceled'];

        this.schemaProduct = {
            name: undefined,
            description: undefined,
            tags: [],
            price: undefined,
            count: undefined,
            image: undefined,
            category: undefined,
        }
        this.schemaUser = {
            login: undefined,
            password: undefined,
            mail: undefined,
            historyTransactions: [],
            activeBasket: "",
            countIncorrectLogin: 0,
            permission: "user",
            refreshToken: ""
        }
        this.schemaTransaction = {
            products: [],
            userId: undefined,
            fulName: undefined,
            adress: undefined,
            status: this.statuses[0],
            date: undefined,
            sumPrice: undefined,
        }
    }

    validateProduct(product) {
        return new Promise((resolve, reject) => {
            const validateItem = { ...this.schemaProduct, ...product };
            let isCorrect = true;
            for (let item in validateItem) {
                if (validateItem[item] === undefined) isCorrect = false;
            }
            if (isCorrect) resolve(validateItem)
            reject('not enough properties')
        })
    }

    validateUser(user) {
        return new Promise((resolve, reject) => {
            const validateUser = { ...this.schemaUser, ...user };
            let isCorrect = true;
            for (let user in validateUser) {
                if (validateUser[user] === undefined) isCorrect = false;
            }
            if (isCorrect) resolve(validateUser)
            reject('not enough user informations')
        })
    }
    validateTransaction(transaction) {
        const validateTransaction = { ...this.schemaTransaction, ...transaction };

        let isCorrect = true;
        for (let transaction in validateTransaction) {
            if (validateTransaction[transaction] === undefined) {
                isCorrect = false;
                break;
            } else if (Array.isArray(validateTransaction[transaction]) && validateTransaction[transaction].length === 0) {
                isCorrect = false;
                break;
            }
        }
        if (isCorrect) return validateTransaction;
        return false;
    }
}


module.exports = Validate;