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
    const cast = req.body.cast;
    const directorInDatabase = await Director.findById(director);
    if(!directorInDatabase){
        const error = new Error('Director not found');
        error.statusCode = 404;
        return next(error);
    }
    const actorsInDatabase = await Promise.all(cast.map(async (actor) =>{
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

exports.editMovie = async (req, res, next) =>{
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
    const movieId = req.params.movieId;
    const title = req.body.title;
    const description = req.body.description;
    const year = req.body.year;
    const director = req.body.director;
    const cast = req.body.cast;
    const movie = await Movie.findById(movieId);
    if(!movie){
        const error = new Error('Could not find movie');
        error.statusCode = 404;
        return next(error);
    }
    if(req.file){
        deleteFile(path.join(__dirname, '..', movie.posterUrl));
        movie.posterUrl = req.file.path.replace('\\', '/');
    }
    movie.title = title;
    movie.description = description;
    movie.year = year;
    if(movie.director.toString() !== director.toString()){
        const newDirector = await Director.findById(director);
        const oldDirector = await Director.findById(movie.director);
        if(!newDirector || !oldDirector){
            const error = new Error('Could not find director');
            error.statusCode = 404;
            return next(error);
        }
        newDirector.movies.push(movieId);
        oldDirector.movies.pull(movieId);
        await newDirector.save();
        await oldDirector.save();
        movie.director = director;
    }
    const allActors = await Actor.find();
    await Promise.all(allActors.map(async (actor) =>{
        if(!cast.includes(actor._id.toString()) && movie.cast.includes(actor._id.toString())){
            actor.movies.pull(movieId);
            return await actor.save();
        }
        if(cast.includes(actor._id.toString()) && !movie.cast.includes(actor._id.toString())){
            actor.movies.push(movieId);
            return await actor.save();
        }
    }))
    movie.cast = cast;
    await movie.save();
    return res.status(200).json({message: 'Movie updated successfully'});
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
    const actors = await Actor.find({movies: {$in: [movieId]}});
    if(!actors){
        const error = new Error('Could not find actors');
        error.statusCode = 404;
        return next(error);
    }
    director.movies.pull(movieId);
    await director.save();
    await Promise.all(actors.map(async (actor) =>{
        actor.movies.pull(movieId);
        return await actor.save();
    }))
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

exports.editDirector = async (req, res, next) =>{
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
    const directorId = req.params.directorId;
    const name = req.body.name;
    const bio = req.body.bio;
    const age = req.body.age;
    const director = await Director.findById(directorId);
    if(!director){
        const error = new Error('Could not find director');
        error.statusCode = 404;
        return next(error);
    }
    director.name = name;
    director.bio = bio;
    director.age = age;
    if(req.file){
        deleteFile(path.join(__dirname, '..', director.imageUrl));
        director.imageUrl = req.file.path.replace('\\', '/');
    }
    await director.save();
    return res.status(200).json({message: 'Director updated successfully'});
}

exports.deleteDirector = async (req, res, next)=>{
    const directorId = req.params.directorId;
    const director = await Director.findById(directorId);
    if(!director){
        const error = new Error('Could not find director');
        error.statusCode = 404;
        return next(error);
    }
    const movies = await Movie.find({director: directorId});
    if(!movies){
        const error = new Error('Could not find movies');
        error.statusCode = 404;
        return next(error);
    }
    await Promise.all(movies.map(async (movie) =>{
        const actors = await Actor.find({movies: {$in: [movie._id]}});
        return await Promise.all(actors.map(async (actor) =>{
            actor.movies.pull(movie._id);
            return await actor.save();
        }))
    }));
    await Promise.all(movies.map(async (movie) =>{
        deleteFile(path.join(__dirname, '..', movie.posterUrl));
        return await Movie.findByIdAndDelete(movie._id);
    }));
    deleteFile(path.join(__dirname, '..', director.imageUrl));
    await Director.findByIdAndDelete(directorId);
    return res.status(200).json({message: 'Director and all of their movies have been deleted'});
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

exports.editActor = async (req, res, next) =>{
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
    const actorId = req.params.actorId;
    const name = req.body.name;
    const bio = req.body.bio;
    const age = req.body.age;
    const actor = await Actor.findById(actorId);
    if(!actor){
        const error = new Error('Could not find actor');
        error.statusCode = 404;
        return next(error);
    }
    actor.name = name;
    actor.bio = bio;
    actor.age = age;
    if(req.file){
        deleteFile(path.join(__dirname, '..', actor.imageUrl));
        actor.imageUrl = req.file.path.replace('\\', '/');
    }
    await actor.save();
    return res.status(200).json({message: 'Actor updated successfully'});
}

exports.deleteActor = async (req, res, next) =>{
    const actorId = req.params.actorId;
    const actor = await Actor.findById(actorId);
    if(!actor){
        const error = new Error('Could not find actor');
        error.statusCode = 404;
        return next(error);
    }
    const movies = await Promise.all(actor.movies.map(async (movieId) =>{
        return await Movie.findById(movieId);
    }))
    if(!movies){
        const error = new Error('Could not find movies');
        error.statusCode = 404;
        return next(error);
    }
    await Promise.all(movies.map(async (movie) =>{
        movie.cast.pull(actorId);
        return await movie.save();
    }));
    deleteFile(path.join(__dirname, '..', actor.imageUrl));
    await Actor.findByIdAndDelete(actorId);
    return res.status(200).json({message: 'Actor deleted successfully'});
}