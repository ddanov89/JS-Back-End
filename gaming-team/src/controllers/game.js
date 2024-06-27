const { Router } = require('express');
const { isUser } = require('../middlewares/guards');
const { body, validationResult } = require('express-validator');
const { createGame, getGameById, updateGame, deleteGameById, buyGame } = require('../services/game');
const { parseError } = require('../util');

const gameRouter = Router();

gameRouter.get('/create', isUser(), async (req, res) => {
    res.render('create');
});

gameRouter.post('create', isUser(),
    body('platform').trim(),
    body('name').trim().isLength({ min: 4 }).withMessage('Name field should be at least 4 characters long!'),
    body('image').trim().isURL({ require_tld: false, require_protocol: true }).withMessage('Image field should be start with http:// or https://!'),
    body('price').trim().isInt({ min: 0 }).withMessage('Price field should be a non-negative number!'),
    body('genre').trim().isLength({ min: 2 }).withMessage('Genre field should be at least 10 characters long!'),
    body('description').trim().isLength({ min: 10 }).withMessage('Description field should be at least 10 characters long!'),
    async (req, res) => {
        const userId = req.user._id;
        try {
            const validation = validationResult(req);
            if (validation.errors.length) {
                throw validation.errors;
            }
            const result = await createGame(req.body, userId);
            res.redirect('/');
        } catch (error) {
            res.render('create', { data: req.body, errors: parseError(error).errors });
        }
    });
gameRouter.get('/edit/:id', isUser(), async (req, res) => {
    const gameId = req.params.id;
    const game = await getGameById(gameId);
    if (!game) {
        res.status(404).render('404');
        return;
    }
    res.render('edit', { data: game });
});

gameRouter.post('/edit/:id', isUser(),
    body('platform').trim(),
    body('name').trim().isLength({ min: 4 }).withMessage('Name field should be at least 4 characters long!'),
    body('image').trim().isURL({ require_tld: false, require_protocol: true }).withMessage('Image field should be start with http:// or https://!'),
    body('price').trim().isInt({ min: 0 }).withMessage('Price field should be a non-negative number!'),
    body('genre').trim().isLength({ min: 2 }).withMessage('Genre field should be at least 10 characters long!'),
    body('description').trim().isLength({ min: 10 }).withMessage('Description field should be at least 10 characters long!'),
    async (req, res) => {
        const gameId = req.params.id;
        const userId = req.user._id;
        try {
            const validation = validationResult(req);
            if (validation.errors.length) {
                throw validation.errors;
            }
            const result = await updateGame(gameId, req.body, userId);
            res.redirect('/catalog/' + gameId);
        } catch (error) {
            res.render('edit', { data: req.body, errors: parseError(error).errors });
        }
    });

gameRouter.get('/delete/:id', isUser(), async (req, res) => {
    const id = req.params.id;
    try {
        await deleteGameById(id, req.user._id);
    } catch (error) {
        if (error.message == 'Access denied!') {
            res.redirect('/login');
            return;
        }
    }
    res.redirect('/catalog');
});

gameRouter.get('/buy/:id', isUser(), async (req, res) => {

    const gameId = req.params.id;
    const userId = req.user._id;

    try {

        const result = await buyGame(gameId, userId);
        res.redirect('/catalog' + gameId);

    } catch (error) {
        res.render('details', { errors: parseError(error).errors });
    }
});

module.exports = { gameRouter };