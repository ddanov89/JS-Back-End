const { Router } = require("express");
const { getById, getAll } = require("../services/course");

const catalogRouter = Router();

catalogRouter.get('/catalog', async (req, res) => {
    const courses = await getAll();
    res.render('catalog', { courses });
});

catalogRouter.get('/catalog/:id', async (req, res) => {
    const courseId = req.params.id;
    const course = await getById(courseId);

    if (!course) {
        res.status(404).render('404');
        return;
    }
    // course.signUps = res.signUpList.length;

    course.hasUser = res.locals.hasUser;
    course.isAuthor = res.user?._id == course.author.toString();
    course.hasSigned = Boolean(course.signUpList.find(s => s.toString() == req.user?._id));

    res.render('details', { course });
});

module.exports = { catalogRouter };