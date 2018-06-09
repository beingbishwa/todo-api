const {User} = require('./../db/collections/user')

const authenticate = function(req, res, next) {
    // get token from header
    const token = req.header('x-auth')
    // check if the user with token exist
    User.findByToken(token)
    .then(data => {
        req.user = data
        req.token = token
        next()
    }).catch(err => {
        res.status(401).send({
            message: err
        })
    })
}

module.exports = {authenticate}