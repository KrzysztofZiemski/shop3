const express = require('express');
const Config = require('./Config.js');
const path = require('path');

const AppRouters = require('./routers');

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

class App {
    constructor() {
        this.httpApp = express();
        this.config = new Config;

        this.stratServer(this.config.port).then(() => {
            console.log(`server runned on port ${this.config.port}`)
        })

        this.httpApp.use('/server', new AppRouters().router)
        // this.httpApp.use('/', express.static(path.join(__dirname, 'public')))


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


