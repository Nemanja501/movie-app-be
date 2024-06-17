const express = require('express');
const router = express.Router();
const { body } = require('express-validator');

const isAdmin = require('../middleware/is-admin');
const isAuth = require('../middleware/is-auth');
const adminController = require('../controllers/admin');

router.post('/add-movie', isAuth, isAdmin, [
    body('title').trim().notEmpty().withMessage('Title must not be empty'),
    body('description').trim().isLength({min: 20, max: 800}).withMessage('Description must be between 20 and 800 characters'),
    body('year').trim().isInt().withMessage('Year of release must be a number'),
    body('director').notEmpty().withMessage('Must pick a director'),
    body('actors').isArray({min: 1}).withMessage('Must pick at least one actor'),
    body('image').custom((value, {req}) =>{
        if(!req.file){
            throw new Error('Must include a poster');
        }
        return true;
    })
],  adminController.addMovie);

router.post('/movies/:movieId', isAuth, isAdmin, adminController.deleteMovie);

router.post('/add-director', isAuth, isAdmin, [
    body('name').trim().notEmpty().withMessage('Name must not be empty'),
    body('bio').trim().isLength({min: 20, max: 800}).withMessage('Bio must be between 20 and 800 characters'),
    body('age').trim().isInt().withMessage('Age must be a number'),
    body('image').custom((value, {req}) =>{
        if(!req.file){
            throw new Error('Must include an image');
        }
        return true;
    })
], adminController.addDirector);

router.post('/add-actor', isAuth, isAdmin, [
    body('name').trim().notEmpty().withMessage('Name must not be empty'),
    body('bio').trim().isLength({min: 20, max: 800}).withMessage('Bio must be between 20 and 800 characters'),
    body('age').trim().isInt().withMessage('Age must be a number'),
    body('image').custom((value, {req}) =>{
        if(!req.file){
            throw new Error('Must include an image');
        }
        return true;
    })
], adminController.addActor);

module.exports = router;