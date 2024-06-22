const express = require('express');
const router = express.Router();

const movieController = require('../controllers/movie');

router.get('/movies', movieController.getMovies);
router.get('/movies/:id', movieController.getSingleMovie);
router.get('/get-movie-data/:movieId', movieController.getSingleMovieData);

module.exports = router;