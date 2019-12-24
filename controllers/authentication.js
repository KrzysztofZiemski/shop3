const express = require('express');
const bcrypt = require('bcryptjs');
const PouchDB = require('pouchdb');
const jwt = require('jsonwebtoken');

const Validate = require('../schema.js');

class AuthenticationRouter {
    constructor() {
        this.db = new PouchDB('./db/users');
        this.validate = new Validate();
    }

    checkPassword(password, confirmPassword) {
        return bcrypt.compare(confirmPassword, password);
    }
    generateTokens(user) {
        const ACCESS_TOKEN = jwt.sign({
            sub: user._id,
            rol: user.permission,
            type: 'ACCESS_TOKEN'
        },
            this.validate.TOKEN_SECRET_JWT, {
            expiresIn: 1800
        });

        return {
            accessToken: ACCESS_TOKEN
        }
    }

    async authorization(user, confirmPassword) {
        const isCorrect = await this.checkPassword(user.password, confirmPassword);
        if (!isCorrect) return null;
        return this.generateTokens(user)
    }


}
////////////nie dziala porownanie, czy dziala zmiana?
module.exports = AuthenticationRouter;