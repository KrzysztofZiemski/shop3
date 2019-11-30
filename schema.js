
class Validate {
    constructor() {
        this.schema = {
            name: undefined,
            description: undefined,
            tags: [],
            price: undefined,
            count: undefined,
            img: undefined,
        }
    }
    validateProduct(product) {
        return new Promise((resolve, reject) => {
            const validateItem = { ...this.schema, ...product };
            let isCorrect = true;
            for (let item in validateItem) {
                if (validateItem[item] === undefined) isCorrect = false;
            }
            if (isCorrect) resolve()
            reject('not enough properties')
        })
    }

}


module.exports = Validate;