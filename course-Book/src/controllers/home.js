const { Router } = require("express");
const { getAll } = require("../services/course");

const homeRouter = Router();

homeRouter.get('/', async (req, res) => {
    const courses = await getAll();
    res.render('home', { courses });
});

module.exports = { homeRouter };