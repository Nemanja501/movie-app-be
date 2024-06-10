const Movie = require('../models/movie');

exports.getMovies = async (req, res, next) =>{
    const movies = await Movie.find();
    return res.status(200).json({message: 'Movies fetched successfully', movies});
}