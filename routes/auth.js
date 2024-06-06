const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const bcrypt = require('bcrypt');
const User = require('../models/user');

const authController = require('../controllers/auth');

router.post('/signup', [
    body('name').trim().notEmpty().withMessage('Name must not be empty'),
    body('email').trim().isEmail().withMessage('Please enter a valid email').custom(async (value, {req}) =>{
        const user = await User.findOne({email: value});
        if(user){
            throw new Error('A user with this email already exists');
        }
        return true;
    }),
    body('password').trim().isLength({min: 6}).withMessage('Password needs to have at least 6 characters'),
    body('confirmPassword').custom((value, {req}) =>{
        if(value !== req.body.password){
            throw new Error('Password confirmation must match the password');
        }
        return true;
    })
], authController.signup);

let user;

router.post('/login', [
    body('email').trim().isEmail().withMessage('Please enter a valid email').custom(async (value, {req}) =>{
        user = await User.findOne({email: value});
        if(!user){
            throw new Error('A user with this email does not exist');
        }
        return true;
    }),
    body('password').trim().isLength({min: 6}).withMessage('Password needs to have at least 6 characters').custom(async (value, {req}) =>{
        if(!user){
            return false;
        }
        const isMatch = await bcrypt.compare(value, user.password);
        if(!isMatch){
            throw new Error('Password is incorrect');
        }
        return true;
    })
],  authController.login);

router.post('/get-is-admin', authController.getIsAdmin);

module.exports = router;