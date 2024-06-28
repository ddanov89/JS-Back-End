const { Router } = require('express');
const { isUser } = require('../middlewares/guards');
const { body, validationResult } = require('express-validator');
const { createRecipe, getRecipeById, updateRecipe, deleteRecipeById, addRecommendation } = require('../services/recipe');
const { parseError } = require('../util');

const recipeRouter = Router();

recipeRouter.get('/create', isUser(), (req, res) => {
    res.render('create');
});

recipeRouter.post('/create', isUser(),
    body('title').trim().isLength({ min: 2 }).withMessage('Title should be at least 2 characters long!'),
    body('description').trim().isLength({ min: 10, max: 100 }).withMessage('Description should be between 10 and 100 characters long!'),
    body('ingredients').trim().isLength({ min: 10, max: 200 }).withMessage('Ingredients should be between 10 and 200 characters long!'),
    body('instructions').trim().isLength({ min: 10 }).withMessage('Instructions should be at least 10 characters long!'),
    body('image').trim().isURL({ require_tld: false, require_protocol: true }).withMessage('Image should start with either http://, or https://'),
    async (req, res) => {
        const userId = req.user._id;
        try {
            const validation = validationResult(req);
            if (validation.errors.length) {
                throw validation.errors;
            }
            const result = await createRecipe(req.body, userId);
            res.redirect('/');
        } catch (error) {
            res.render('create', { data: req.body, errors: parseError(error).errors });
        }
    });

recipeRouter.get('/edit/:id', isUser(), async (req, res) => {

    const recipeId = req.params.id;
    const userId = req.user._id;

    const recipe = await getRecipeById(recipeId);

    if (!recipe) {
        res.status(404).render('404');
        return;
    }
    if (recipe.author.toString() != userId) {
        res.redirect('/login');
    }

    res.render('edit', { data: recipe });
});

recipeRouter.post('/edit/:id', isUser(),
    body('title').trim().isLength({ min: 2 }).withMessage('Title should be at least 2 characters long!'),
    body('description').trim().isLength({ min: 10, max: 100 }).withMessage('Description should be between 10 and 100 characters long!'),
    body('ingredients').trim().isLength({ min: 10, max: 200 }).withMessage('Ingredients should be between 10 and 200 characters long!'),
    body('instructions').trim().isLength({ min: 10 }).withMessage('Instructions should be at least 10 characters long!'),
    body('image').trim().isURL({ require_tld: false, require_protocol: true }).withMessage('Image should start with either http://, or https://'),
    async (req, res) => {

        const recipeId = req.params.id;
        
        try {
            const validation = validationResult(req);
            if (validation.errors.length) {
                throw validation.errors;
            }
            const result = await updateRecipe(recipeId, req.body, req.user._id);
            res.redirect('/catalog/' + recipeId);
        } catch (error) {
            res.render('edit', { data: req.body, errors: parseError(error).errors });
        }
    });

recipeRouter.get('/delete/:id', isUser(), async (req, res) => {
    const id = req.params.id;
    
    try {
        await deleteRecipeById(id, req.user._id);
    } catch (error) {
        if (error.message == "Access denied!") {
            res.redirect('/login');
            return;
        }
    }
    res.redirect('/catalog');
});

recipeRouter.get('/recommend/:id', isUser(), async (req, res) => {
    const recipeId = req.params.id;
    const userId = req.user._id;
    try {
        const result = await addRecommendation(recipeId, userId);
        res.redirect('/catalog/' + recipeId);
    } catch (error) {
        res.render('details', { errors: parseError(error).errors });
    }
});

module.exports = { recipeRouter };