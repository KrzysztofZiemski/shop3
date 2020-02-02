const express = require('express');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const ApiRouter = require('./api');
const UsersRouter = require('./users.js');
const AuthRouter = require('./authentication.js');
const Transactions = require('./transactions.js');

class AppRouter {
    constructor() {
        this.router = express.Router();
        this.routes();
    }
    // /server


    routes() {

        this.router.use('/api', jsonParser, new ApiRouter().router);
        this.router.use('/users', jsonParser, new UsersRouter().router);
        this.router.use('/auth', jsonParser, new AuthRouter().router);
        this.router.use('/transactions', jsonParser, new Transactions().router);
    }
}


module.exports = AppRouter;