const jwt = require('jsonwebtoken')
const config = require('config')
const { successfulBody, failureBody } = require("../tools/routing_tools");

module.exports = function (req, res, next) {
    const token = req.header('x-auth-token')
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' })
    }
    try {
        const decoded = jwt.verify(token, config.get('jwtSecret'))
        req.employee = decoded.employee
        next()
    } catch (error) {
        return res.send(failureBody())
       
    }
}