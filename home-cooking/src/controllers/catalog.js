const { Router } = require('express');
const { getAllRecipes, getRecipeById, searchRecipes } = require('../services/recipe');
const { isUser, isGuest } = require('../middlewares/guards');

const catalogRouter = Router();

catalogRouter.get('/catalog', async (req, res) => {
    const recipes = await getAllRecipes();
    res.render('catalog', { recipes });
});

catalogRouter.get('/catalog/:id', isUser(), async (req, res) => {

    const recipeId = req.params.id;

    const recipe = await getRecipeById(recipeId);

    if (!recipe) {
        res.status(404).render('404');
        return;
    }
    recipe.recommend = recipe.recommendList.length;

    recipe.hasUser = res.locals.hasUser;
    recipe.isAuthor = req.user?._id == recipe.author.toString();
    recipe.hasBeenRecommended = Boolean(recipe.recommendList.find(recommendation => recommendation.toString() == req.user._id));

    res.render('details', { recipe });
});

catalogRouter.get('/search', async (req, res) => {
    const { title } = req.query;

    const recipes = await searchRecipes(title);
    
    res.render('search', { recipes });
});

module.exports = { catalogRouter };