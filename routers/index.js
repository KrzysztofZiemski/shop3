const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const Config = require('../config.js');
const ApiRouter = require('./api');
const AdminRouter = require('./admin.js');
const AuthenticationRouter = require('./authentication.js');
const UsersRouter = require('./users.js');


class AppRouter {
    constructor() {
        this.router = express.Router();
        this.routes();
    }
    // /server


    routes() {
        this.router.use('/api', jsonParser, new ApiRouter().router);
        // this.router.use('/admin', new AdminRouter().router);
        // this.router.use('/authentication', new AuthenticationRouter().router);
        this.router.use('/users', jsonParser, new UsersRouter().router);
    }
}


module.exports = AppRouter;