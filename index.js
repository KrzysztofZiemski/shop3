const express = require('express');
const path = require('path');
const cors = require('cors');
const AppRouters = require('./routers');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();


const corsOptions = {
    origin: 'http://localhost:3000.com'
}
/** ustawienie headerow pod CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
      'Access-Control-Allow-Methods',
      'OPTIONS, GET, POST, PUT, PATCH, DELETE'
    );
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
  });
*/

class App {
    constructor() {
        this.httpApp = express();
        this.httpApp.use(cors(corsOptions))
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


