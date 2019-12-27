const express = require('express');
const path = require('path');
const fs = require('fs');
const mime = require('mime-types');

class Admin {
    constructor() {
        this.router = express.Router();
        this.routers();
    }
    //admin
    routers() {
        this.router.use('/', (req, res) => {
            fs.readFile(path.join(__dirname, '/../adminSite/index.html'), 'utf8', function (err, file) {
                res.send(file);
            });
        });
        //nie wiem jak obejść mimetype w type module
        // this.router.use('/script', (req, res) => {

        //     fs.readFile(path.join(__dirname, '/../adminSite/adminSite.js'), 'utf8', function (err, file) {
        //         res.setHeader("Content-Type", 'text/javascript');
        //         res.send(file);
        //     });
        // });
    }
}

module.exports = Admin;