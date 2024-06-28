const { Router } = require("express");
const { getAllRecipes } = require("../services/recipe");

const homeRouter = Router();

homeRouter.get('/', async (req, res) => {
    const recipes = await getAllRecipes();
    res.render('home', { recipes });
});

module.exports = { homeRouter };