const path = require('path');
const Movie = require('../models/movie');
const Director = require('../models/director');
const Actor = require('../models/actor');
const {validationResult} = require('express-validator');
const {deleteFile} = require('../util/file');

exports.addMovie = async (req, res, next) =>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        const error = new Error('Validation failed');
        error.statusCode = 422;
        error.data = errors.array();
        if(req.file){
            deleteFile(req.file.path);
        }
        return next(error);
    }
    const title = req.body.title;
    const description = req.body.description;
    const year = req.body.year;
    const posterUrl = req.file.path.replace('\\', '/');
    const director = req.body.director;
    const actors = req.body.actors;
    const directorInDatabase = await Director.findById(director);
    if(!directorInDatabase){
        const error = new Error('Director not found');
        error.statusCode = 404;
        return next(error);
    }
    const actorsInDatabase = await Promise.all(actors.map(async (actor) =>{
        const actorInDatabase = await Actor.findById(actor);
        if(!actorInDatabase){
            const error = new Error('Actors not found');
            error.statusCode = 404;
            return next(error);
        }
        return actorInDatabase;
    }))
    const movie = new Movie({
        title,
        description,
        year,
        posterUrl,
        director: directorInDatabase,
        cast: actorsInDatabase
    });
    const movieInDatabase = await movie.save();
    directorInDatabase.movies.push(movieInDatabase);
    await directorInDatabase.save();
    actorsInDatabase.forEach(async (actor) => {
        actor.movies.push(movieInDatabase);
        await actor.save();
    });
    
    return res.status(201).json({message: 'Movie added successfully'});
}

exports.deleteMovie = async (req, res, next) =>{
    const movieId = req.params.movieId;
    const movie = await Movie.findById(movieId);
    if(!movie){
        const error = new Error('Could not find movie');
        error.statusCode = 404;
        return next(error);
    }
    const director = await Director.findById(movie.director);
    if(!director){
        const error = new Error('Could not find director');
        error.statusCode = 404;
        return next(error);
    }
    director.movies.pull(movieId);
    await director.save();
    deleteFile(path.join(__dirname, '..', movie.posterUrl));
    await Movie.findByIdAndDelete(movieId);
    return res.status(200).json({message: 'Movie deleted'});
}

exports.addDirector = async (req, res, next) =>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        const error = new Error('Validation failed');
        error.statusCode = 422;
        error.data = errors.array();
        if(req.file){
            deleteFile(req.file.path);
        }
        return next(error);
    }
    const name = req.body.name;
    const bio = req.body.bio;
    const age = req.body.age;
    const imageUrl = req.file.path.replace('\\', '/');
    const director = new Director({
        name,
        bio,
        age,
        imageUrl
    });
    await director.save();
    return res.status(201).json({message: 'Director added successfully'});
}

exports.addActor = async (req, res, next) =>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        const error = new Error('Validation failed');
        error.statusCode = 422;
        error.data = errors.array();
        if(req.file){
            deleteFile(req.file.path);
        }
        return next(error);
    }
    const name = req.body.name;
    const bio = req.body.bio;
    const age = req.body.age;
    const imageUrl = req.file.path.replace('\\', '/');
    const actor = new Actor({
        name,
        bio,
        age,
        imageUrl
    });
    await actor.save();
    return res.status(201).json({message: 'Actor added successfully'});
}