const { Router } = require('express');

const { body, validationResult } = require('express-validator');
const { isGuest } = require('../middlewares/guards');
const { login, register } = require('../services/user');
const { createToken } = require('../services/jwt');
const { parseError } = require('../util');

const userRouter = Router();

userRouter.get('/login', isGuest(), (req, res) => {
    res.render('login');
});

userRouter.post('/login', isGuest(),
    body('email').trim().isEmail().isLength({ min: 10 }).withMessage('Email should be at least 10 characters long!'),
    body('password').trim().isLength({ min: 4 }).withMessage('Password should be at least 4 characters long!'),
    async (req, res) => {

        const { email, password } = req.body;

        try {
            const result = await login(email, password);
            const token = createToken(result);
            res.cookie('token', token);
            res.redirect('/');
        } catch (error) {
            res.render('login', { data: { email }, errors: parseError(error).errors });
        }
    });

userRouter.get('/register', isGuest(), (req, res) => {
    res.render('register');
});
userRouter.post('/register', isGuest(),
    body('email').trim().isEmail().isLength({ min: 10 }).withMessage('Email should be at least 10 characters long!'),
    body('username').trim().isLength({ min: 3 }).withMessage('Username should be at least 3 characters long!'),
    body('password').trim().isLength({ min: 4 }).withMessage('Password should be at least 4 characters long!'),
    body('repass').trim().custom((value, { req }) => {
        return value == req.body.password;
    }).withMessage('Passwords don\'t match!'),
    async (req, res) => {

        const { email, username, password } = req.body;
        try {
            const validation = validationResult(req);
            if (validation.errors.length) {
                throw validation.errors;
            }
            const result = await register(email, username, password);
            const token = createToken(result);
            res.cookie('token', token);
            res.redirect('/');
        } catch (error) {
            res.render('register', { data: { email, username }, errors: parseError(error).errors });
        }
    });

userRouter.get('/logout', async (req, res) => {
    res.clearCookie('token');
    res.redirect('/');
});

module.exports = { userRouter };