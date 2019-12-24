const Validate = require('../schema.js');
const jwt = require('jsonwebtoken');


const checkToken = (req, res, next) => {
    const config = new Validate();
    if (req.headers.authorization === undefined) {
        res.status(401);
        return
    }
    const AUTHORIZATION_TOKEN = req.headers.authorization.split(' ');
    if (AUTHORIZATION_TOKEN[0] !== 'Bearer') {
        return res.status(401).send({
            error: "Token is not complete"
        })

    }
    jwt.verify(AUTHORIZATION_TOKEN[1], config.TOKEN_SECRET_JWT, (err, decoded) => {
        if (err) {
            return res.status(401).send({
                error: "Token is invalid"
            });
        }
        req.body.tokenId = decoded;
        next()
    })
}

module.exports = checkToken;