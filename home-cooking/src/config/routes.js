const { homeRouter } = require("../controllers/home");
const { catalogRouter } = require("../controllers/catalog");
const { userRouter } = require("../controllers/user");
const { recipeRouter } = require("../controllers/recipe");

function configRoutes(app) {

    app.use(homeRouter);
    app.use(userRouter);
    app.use(catalogRouter);
    app.use(recipeRouter);

    app.use('*', (req, res) => {
        res.status(404).render('404');
    });
}

module.exports = { configRoutes };