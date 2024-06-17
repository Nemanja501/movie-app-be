const Actor = require('../models/actor');

exports.getActors = async (req, res, next) =>{
    const actors = await Actor.find();
    return res.status(200).json({message: 'Actors fetched successfully', actors});
}