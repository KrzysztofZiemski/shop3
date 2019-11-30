function Errors(err, res) {
    if (err.status) return res.status(err.status).send(err)
    return res.status(400).send(err)
}

module.exports = Errors;