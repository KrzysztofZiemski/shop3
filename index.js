const express = require('express');
const config = require('./config.js');

class App {
    constructor() {
        this.httpApp = express();
        this.stratServer(config.port).then(() => {
            console.log('server runned on port 3000')
        })

    }

    stratServer(port) {
        return new Promise((resolve) => {
            this.httpApp.listen(port, () => {
                resolve()
            })
        })
    }
}


const app = new App;