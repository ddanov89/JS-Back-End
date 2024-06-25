const { Router } = require("express");
const { body, validationResult } = require('express-validator');

const { parseError } = require('../util');
const { isUser } = require("../middlewares/guards");
const { createCourse, getById, updateCourse, deleteCourseById, getMySignUp, getMyCreatedCourses } = require("../services/course");

const courseRouter = Router();

courseRouter.get('/create', isUser(), (req, res) => {
    res.render('create');
});

courseRouter.post('/create', isUser(),

    async (req, res) => {

        const userId = req.user._id;
        try {
            const validation = validationResult(req);

            if (validation.errors.length) {
                throw validation.errors;
            }
            const result = await createCourse(req.body, userId);
            res.redirect('/');
        } catch (error) {
            res.render('create', { data: req.body, errors: parseError(error).errors });
        }
    });

courseRouter.get('/edit/:id', isUser(), async (req, res) => {
    const id = req.params.id;
    const course = await getById(id);
    if (!course) {
        res.status(404).render('404');
        return;
    }
    if (course.author.toString() != req.user._id) {
        res.redirect('/login');
    }
    res.render('edit', { data: course });
});
courseRouter.post('/edit/:id', isUser(),
    body('title').trim().isLength({ min: 5 }).withMessage('Title should be at least 5 characters long!'),
    body('image').trim().isURL({ require_tld: false, require_protocol: true }).withMessage('Image should start with http:// or https://!'),
    body('type').trim().isLength({ min: 3 }).withMessage('Type should be at least 3 characters long!'),
    body('certificate').trim().isLength({ min: 2 }).withMessage('Certificate should be at least 10 characters long!'),
    body('price').trim().isInt({ min: 0 }).withMessage('Price should be a positive number!'),
    async (req, res) => {
        const courseId = req.params.courseId;
        const userId = req.user._id;

        try {
            const validation = validationResult(req);
            if (validation.errors.length) {
                throw validation.errors;
            }

            const result = await updateCourse(courseId, req.body, userId);
            res.redirect('/catalog/' + courseId);
        } catch (error) {
            res.render('edit', { data: req.body, errors: parseError(error).errors });
        }
    });
courseRouter.get('/delete/:id', isUser(), async (req, res) => {
    const id = req.params.id;

    try {
        await deleteCourseById(id, req.user._id);
    } catch (error) {
        if (error.message == 'Access denied!') {
            res.redirect('/login');
            return;
        }
    }
    res.render('/catalog');
});

courseRouter.get('/profile', isUser(), async (req, res) => {
    const userId = req.user._id;

    let signUp = await getMySignUp(userId);
    let created = await getMyCreatedCourses(userId);
    res.render('profile', { signUp, created })
});

module.exports = { courseRouter };