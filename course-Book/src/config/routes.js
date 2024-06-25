const { catalogRouter } = require("../controllers/catalog");
const { courseRouter } = require("../controllers/course");
const { homeRouter } = require("../controllers/home");
const { userRouter } = require("../controllers/user");

function configRoutes(app) {

    app.use(homeRouter);
    app.use(userRouter);
    app.use(catalogRouter);
    app.use(courseRouter);

    app.use('*', (req, res) => {
        res.status(404).render('404');
    });
}

module.exports = { configRoutes };