const Movie = require('../models/movie');

exports.getMovies = async (req, res, next) =>{
    const page = req.query.page || 1;
    const perPage = 4;
    const totalItems = await Movie.find().countDocuments();
    const movies = await Movie.find().skip((page - 1) * perPage).limit(perPage);
    if(!movies){
        const error = new Error('Movies not found');
        error.statusCode = 404;
        return next(error);
    }
    return res.status(200).json({message: 'Movies fetched successfully', movies, totalItems});
}

exports.getSingleMovie = async (req, res, next) =>{
    const id = req.params.id;
    const movie = await Movie.findById(id).populate('director').populate('cast');
    if(!movie){
        const error = new Error('Movie not found');
        error.statusCode = 404;
        return next(error);
    }
    return res.status(200).json({message: 'Movie fetched successfully', movie});
}

