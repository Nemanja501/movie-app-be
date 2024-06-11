const express = require('express');
const router = express.Router();
const { body } = require('express-validator');

const isAdmin = require('../middleware/is-admin');
const isAuth = require('../middleware/is-auth');
const adminController = require('../controllers/admin');

router.post('/add-movie', isAuth, isAdmin, [
    body('title').trim().notEmpty().withMessage('Title must not be empty'),
    body('description').trim().isLength({min: 10, max: 250}).withMessage('Description must be between 10 and 250 characters'),
    body('year').trim().isInt().withMessage('Year of release must be a number').notEmpty().withMessage('Year of release must not be empty'),
    body('image').custom((value, {req}) =>{
        if(!req.file){
            throw new Error('Must include a poster');
        }
        return true;
    })
],  adminController.addMovie);

module.exports = router;