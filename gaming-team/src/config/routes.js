const { catalogRouter } = require("../controllers/catalog");
const { gameRouter } = require("../controllers/game");
const { homeRouter } = require("../controllers/home");
const { userRouter } = require("../controllers/user");

function configRoutes(app) {
    app.use(homeRouter);
    app.use(catalogRouter);
    app.use(userRouter);
    app.use(gameRouter);

    app.use('*', (req, res) => {
        res.status(404).render('404');
    });
}

module.exports = { configRoutes };