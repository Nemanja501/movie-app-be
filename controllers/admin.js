const Movie = require('../models/movie');
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
    const movie = new Movie({
        title,
        description,
        year,
        posterUrl
    });
    await movie.save();
    return res.status(201).json({message: 'Movie added successfully'});
}