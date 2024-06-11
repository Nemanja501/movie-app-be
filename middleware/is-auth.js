const jwt = require('jsonwebtoken');

module.exports = (req, res, next) =>{
    const authHeader = req.get('Authorization');
    if(!authHeader){
        const error = new Error('Unauthenticated');
        error.statusCode = 401;
        return next(error);
    }
    const token = authHeader.split(' ')[1];
    const verifiedToken = jwt.verify(token, 'mysecret');
    if(!verifiedToken){
        const error = new Error('Unauthenticated');
        error.statusCode = 401;
        return next(error);
    }
    next();
}