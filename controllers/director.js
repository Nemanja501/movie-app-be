const Director = require('../models/director');
const Movie = require('../models/movie');

exports.getDirectors = async (req, res, next) =>{
    const directors = await Director.find();
    return res.status(200).json({message: 'Directors fetched successfully', directors});
}

exports.getDirector = async (req, res, next)=>{
    const directorId = req.params.directorId;
    const page = req.query.page || 1;
    const perPage = 4;
    const director = await Director.findById(directorId).populate({path: 'movies', options: {limit: perPage, skip: (page - 1) * perPage}});
    const totalItems = await Movie.find({director: director._id}).countDocuments();
    return res.status(200).json({message: 'Director fetched successfully', director, totalItems});
}