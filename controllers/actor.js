const Actor = require('../models/actor');
const Movie = require('../models/movie');

exports.getActors = async (req, res, next) =>{
    const actors = await Actor.find();
    return res.status(200).json({message: 'Actors fetched successfully', actors});
}

exports.getActor = async (req, res, next)=>{
    const actorId = req.params.actorId;
    const page = req.query.page || 1;
    const perPage = 4;
    const actor = await Actor.findById(actorId).populate({path: 'movies', options: {limit: perPage, skip: (page - 1) * perPage}});
    const totalItems = await Movie.find({cast: {$in: [actorId]}}).countDocuments();
    return res.status(200).json({message: 'Actor fetched successfully', actor, totalItems});
}

exports.getActorData = async (req, res, next)=>{
    const actorId = req.params.actorId;
    const actor = await Actor.findById(actorId);
    return res.status(200).json({message: 'Actor fetched successfully', actor});
}