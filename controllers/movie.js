const Movie = require('../models/movie');
const User = require('../models/user');
const Review = require('../models/review');
const {validationResult} = require('express-validator');
const mongooose = require('mongoose');

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
    const movie = await Movie.findById(id).populate('director').populate('cast').populate('reviews');
    if(!movie){
        const error = new Error('Movie not found');
        error.statusCode = 404;
        return next(error);
    }
    return res.status(200).json({message: 'Movie fetched successfully', movie});
}

exports.getSingleMovieData = async (req, res, next) =>{
    const movieId = req.params.movieId;
    const movie = await Movie.findById(movieId);
    if(!movie){
        const error = new Error('Movie not found');
        error.statusCode = 404;
        return next(error);
    }
    return res.status(200).json({message: 'Movie fetched successfully', movie});
}

exports.addToWatchlist = async (req, res, next) =>{
    const movieId = req.body.movieId;
    const userId = req.body.userId;
    const movie = await Movie.findById(movieId);
    if(!movie){
        const error = new Error('Movie not found');
        error.statusCode = 404;
        return next(error);
    }
    const user = await User.findById(userId);
    if(!user){
        const error = new Error('User not found');
        error.statusCode = 404;
        return next(error);
    }
    if(user.watchlist.length > 0){
        for(let i = 0; i < user.watchlist.length; i++){
            if(user.watchlist[i].toString() === movieId.toString()){
                const error = new Error('Movie is already in watchlist');
                error.statusCode = 409;
                return next(error);
            }
        }
    }
    if(user.watched.length > 0){
        for(let i = 0; i < user.watched.length; i++){
            if(user.watched[i].movie.toString() === movieId.toString()){
                const error = new Error("You've already watched this movie");
                error.statusCode = 409;
                return next(error);
            }
        }
    }
    user.watchlist.push(movieId);
    await user.save();
    return res.status(200).json({message: 'Movie added to watchlist'});
}

exports.getWatchlist = async (req, res, next) =>{
    const page = req.query.page || 1;
    const perPage = 4;
    const userId = req.body.userId;
    const user = await User.findById(userId).populate({path: 'watchlist', options: {limit: perPage, skip: (page - 1) * perPage}});
    if(!user){
        const error = new Error('User not found');
        error.statusCode = 404;
        return next(error);
    }
    const count = await User.aggregate([{$match: {"_id": new mongooose.Types.ObjectId(userId)}}, {$unwind: '$watchlist'}, {$group: {_id: "$watchlist", count: {$sum: 1}}}]);
    const totalItems = count.length;
    return res.status(200).json({message: 'Watchlist fetched successfully', user, totalItems});
}

exports.removeFromWatchlist = async (req, res, next) =>{
    const userId = req.body.userId;
    const movieId = req.body.movieId;
    const user = await User.findById(userId);
    if(!user){
        const error = new Error('User not found');
        error.statusCode = 404;
        return next(error);
    }
    user.watchlist.pull(movieId);
    await user.save();
    return res.status(200).json({message: 'Removed movie from watchlist'});
}

exports.markAsWatched = async (req, res, next) =>{
    const userId = req.body.userId;
    const movieId = req.body.movieId;
    const user = await User.findById(userId);
    if(!user){
        const error = new Error('User not found');
        error.statusCode = 404;
        return next(error);
    }
    const movie = await Movie.findById(movieId);
    if(!movie){
        const error = new Error('Movie not found');
        error.statusCode = 404;
        return next(error);
    }
    user.watchlist.pull(movieId);
    user.watched.push({movie: movieId, rating: null});
    await user.save();
    return res.status(200).json({message: 'Movie marked as watched'});
}

exports.getWatchedMovies = async (req, res, next) =>{
    const userId = req.body.userId;
    const user = await User.findById(userId).populate('watched.movie');
    if(!user){
        const error = new Error('User not found');
        error.statusCode = 404;
        return next(error);
    }
    return res.status(200).json({message: 'Watched movies fetched successfully', movies: user.watched});
}

exports.removeFromWatchedMovies = async (req, res, next) =>{
    const userId = req.body.userId;
    const movieId = req.body.movieId;
    const user = await User.findById(userId);
    if(!user){
        const error = new Error('User not found');
        error.statusCode = 404;
        return next(error);
    }
    await User.findOneAndUpdate({_id: userId}, {$pull: {"watched": {"movie": movieId}}});
    await user.save();
    return res.status(200).json({message: 'Removed movie from watched movies'});
}

exports.addMovieRating = async (req, res, next) =>{
    const movieId = req.body.movieId;
    const userId = req.body.userId;
    const rating = req.body.rating;
    const user = await User.findById(userId);
    if(!user){
        const error = new Error('User not found');
        error.statusCode = 404;
        return next(error);
    }
    user.watched.forEach(watchedMovie => {
        if(watchedMovie.movie.toString() === movieId.toString()){
            watchedMovie.rating = rating;
        }
    });
    await user.save();
    return res.status(200).json({message: 'Successfully added rating'});
}

exports.getRating = async (req, res, next) =>{
    const movieId = req.body.movieId;
    const userId = req.body.userId;
    const user = await User.findById(userId);
    if(!user){
        const error = new Error('User not found');
        error.statusCode = 404;
        return next(error);
    }
    let rating = 0;
    user.watched.forEach(watchedMovie =>{
        if(watchedMovie.movie.toString() === movieId.toString()){
            rating = watchedMovie.rating;
        }
    })
    return res.status(200).json({message: 'Rating fetched successfully', rating});
}

exports.addReview = async (req, res, next) =>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        const error = new Error('Validation failed');
        error.statusCode = 422;
        error.data = errors.array();
        return next(error);
    }
    const movieId = req.body.movieId;
    const userId = req.body.userId;
    const title = req.body.title;
    const content = req.body.content;
    const rating = req.body.rating;
    const user = await User.findById(userId);
    if(!user){
        const error = new Error('User not found');
        error.statusCode = 404;
        return next(error);
    }
    const movie = await Movie.findById(movieId);
    if(!movie){
        const error = new Error('Movie not found');
        error.statusCode = 404;
        return next(error);
    }
    const review = new Review({
        author: user.name,
        title,
        content,
        rating,
        movieId
    });
    let hasWatched = false;
    user.watched.forEach(movieData =>{
        if(movieData.movie.toString() === movieId.toString()){
            hasWatched = true;
        }
    })
    if(!hasWatched){
        user.watched.push({movie: movieId, rating: rating});
        await user.save();
    }
    if(user.watchlist.includes(movieId.toString())){
        user.watchlist.pull(movieId);
        await user.save();
    }
    const reviewInDatabase = await review.save();
    movie.reviews.push(reviewInDatabase._id);
    await movie.save();
    return res.status(201).json({message: 'Review successfully created'});
}