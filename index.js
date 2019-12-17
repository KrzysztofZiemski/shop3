const express = require('express');
const path = require('path');
const cors = require('cors');

const AppRouters = require('./routers');

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

class App {
    constructor() {
        this.httpApp = express();
        this.httpApp.use(cors())
        this.httpApp.use(express.static('public'));
        this.stratServer(3000).then(() => {
            console.log(`server runned on port 3000`)
        })

        this.httpApp.use('/server', new AppRouters().router)
        // this.httpApp.use('/', express.static(path.join(__dirname, 'public')))


    }

    stratServer(port) {
        return new Promise((resolve) => {
            this.httpApp.listen(3000, () => {
                resolve()
            })
        })
    }
}


const app = new App;


