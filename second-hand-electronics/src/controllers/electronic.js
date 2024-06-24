const { Router } = require('express');
const { isUser } = require('../middlewares/guards');
const { body, validationResult } = require('express-validator');
const { createElectronic, getById, updateElectronic, deleteById, buyElectronic } = require('../services/electronic');
const { parseError } = require('../util');

const electronicRouter = Router();

electronicRouter.get('/create', isUser(), async (req, res) => {
    res.render('create');
});

electronicRouter.post('create', isUser(),
    body('name').trim().isLength({ min: 10 }).withMessage('Name field should be at least 10 characters long!'),
    body('type').trim().isLength({ min: 2 }).withMessage('Type field should be at least 10 characters long!'),
    body('damages').trim().isLength({ min: 10 }).withMessage('Damages field should be at least 10 characters long!'),
    body('image').trim().isURL({ require_tld: false, require_protocol: true }).withMessage('Image field should be start with http:// or https://!'),
    body('description').trim().isLength({ min: 10, max: 200 }).withMessage('Description field should be between 10 and 200 characters long!'),
    body('production').trim().isInt({ min: 1900, max: 2023 }).withMessage('Production field should be between 1900 and 2023 characters long!'),
    body('exploitation').trim().isInt({ min: 0 }).withMessage('Exploitation field should be a non-negative number!'),
    body('price').trim().isInt({ min: 0 }).withMessage('Name field should be a non-negative number!'),
    async (req, res) => {
        const userId = req.user._id;
        try {
            const validation = validationResult(req);
            if (validation.errors.length) {
                throw validation.errors;
            }
            const result = await createElectronic(req.body, userId);
            res.redirect('/');
        } catch (error) {
            res.render('create', { data: req.body, errors: parseError(error).errors });
        }
    });

electronicRouter.get('/edit/:id', isUser(), async (req, res) => {
    const electronicId = req.params.id;
    const electronic = await getById(electronicId);
    if (!electronic) {
        res.status(404).render('404');
        return;
    }
    res.render('edit', { data: electronic });
});

electronicRouter.post('/edit/:id', isUser(),
    body('name').trim().isLength({ min: 10 }).withMessage('Name field should be at least 10 characters long!'),
    body('type').trim().isLength({ min: 2 }).withMessage('Type field should be at least 10 characters long!'),
    body('damages').trim().isLength({ min: 10 }).withMessage('Damages field should be at least 10 characters long!'),
    body('image').trim().isURL({ require_tld: false, require_protocol: true }).withMessage('Image field should be start with http:// or https://!'),
    body('description').trim().isLength({ min: 10, max: 200 }).withMessage('Description field should be between 10 and 200 characters long!'),
    body('production').trim().isInt({ min: 1900, max: 2023 }).withMessage('Production field should be between 1900 and 2023 characters long!'),
    body('exploitation').trim().isInt({ min: 0 }).withMessage('Exploitation field should be a non-negative number!'),
    body('price').trim().isInt({ min: 0 }).withMessage('Name field should be a non-negative number!'),
    async (req, res) => {
        const electronicId = req.params.id;
        const userId = req.user._id;

        try {
            const validation = validationResult(req);
            if (validation.errors.length) {
                throw validation.errors;
            }
            const result = await updateElectronic(electronicId, req.body, userId);
            res.redirect('/catalog/' + electronicId);
        } catch (error) {
            res.render('edit', { data: req.body, errors: parseError(error).errors });
        }
    });

electronicRouter.get('/delete/:id', isUser(), async (req, res) => {
    const id = req.params.id;
    try {
        await deleteById(id, req.user._id);
    } catch (error) {
        if (error.message == 'Access denied!') {
            res.redirect('/login');
            return;
        }
    }
    res.redirect('/catalog');
});

electronicRouter.get('/buy/:id', isUser(), async (req, res) => {
    const electronicId = req.params.id;
    const userId = req.user._id;
    try {
        const result = await buyElectronic(electronicId, userId);
        res.redirect('/catalog/' + electronicId);

    } catch (error) {
        res.render('details', { errors: parseError(error).errors });
    }
});

module.exports = { electronicRouter };