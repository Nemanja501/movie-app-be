const Director = require('../models/director');

exports.getDirectors = async (req, res, next) =>{
    const directors = await Director.find();
    return res.status(200).json({message: 'Directors fetched successfully', directors});
}

exports.getDirector = async (req, res, next)=>{
    const directorId = req.params.directorId;
    const director = await Director.findById(directorId).populate('movies');
    return res.status(200).json({message: 'Director fetched successfully', director});
}