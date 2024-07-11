const express = require('express');
const router = express.Router();

const movieController = require('../controllers/movie');
const isAuth = require('../middleware/is-auth');
const { body } = require('express-validator');

router.get('/movies', movieController.getMovies);
router.get('/movies/:id', movieController.getSingleMovie);
router.get('/get-movie-data/:movieId', movieController.getSingleMovieData);
router.post('/add-to-watchlist', isAuth, movieController.addToWatchlist);
router.post('/watchlist', isAuth, movieController.getWatchlist);
router.post('/mark-as-watched', isAuth, movieController.markAsWatched);
router.post('/watched-movies', isAuth, movieController.getWatchedMovies);
router.post('/add-rating', isAuth, movieController.addMovieRating);
router.post('/remove-from-watchlist', isAuth, movieController.removeFromWatchlist);
router.post('/remove-from-watched', isAuth, movieController.removeFromWatchedMovies);
router.post('/get-rating', isAuth, movieController.getRating);
router.post('/add-review', [
    body('title').isLength({min: 5}).withMessage('Title must be at least 5 characters long'),
    body('content').isLength({min: 10, max: 300}).withMessage('Content must be between 10 and 300 characters'),
    body('rating').isInt({min: 1}).withMessage('Must include a rating')
], isAuth, movieController.addReview);
router.post('/delete-review', isAuth, movieController.deleteReview);

module.exports = router;