const User = require('../models/user');

module.exports = async (req, res, next) =>{
    const userId = req.body.userId;
    const user = await User.findById(userId);
    if(!user){
        const error = new Error('User not found');
        error.statusCode = 404;
        return next(error);
    };
    if(!user.isAdmin){
        const error = new Error('Not an admin');
        error.statusCode = 403;
        return next(error);
    };
    next();
}