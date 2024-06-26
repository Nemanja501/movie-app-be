const express = require('express');
const router = express.Router();

const movieController = require('../controllers/movie');
const isAuth = require('../middleware/is-auth');

router.get('/movies', movieController.getMovies);
router.get('/movies/:id', movieController.getSingleMovie);
router.get('/get-movie-data/:movieId', movieController.getSingleMovieData);
router.post('/add-to-watchlist', isAuth, movieController.addToWatchlist);
router.post('/watchlist', isAuth, movieController.getWatchlist);
router.post('/mark-as-watched', isAuth, movieController.markAsWatched);
router.post('/watched-movies', isAuth, movieController.getWatchedMovies);
router.post('/add-rating', isAuth, movieController.addMovieRating);

module.exports = router;