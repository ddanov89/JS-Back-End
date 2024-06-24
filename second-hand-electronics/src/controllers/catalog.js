const { Router } = require('express');
const { getAll, getById, searchElectronic } = require('../services/electronic');

const catalogRouter = Router();

catalogRouter.get('/catalog', async (req, res) => {
    const electronics = await getAll();
    res.render('catalog', { electronics });
});

catalogRouter.get('/catalog/:id', async (req, res) => {

    const electronicId = req.params.id;
    const electronic = await getById(electronicId);

    if (!electronic) {
        res.status(404).render('404');
        return;
    }
    electronic.bought = electronic.buyingList.length;

    electronic.hasUser = res.locals.hasUser;
    electronic.isAuthor = req.user?._id == electronic.author.toString();
    electronic.hasBought = Boolean(electronic.buyingList.find(bought => bought.toString() == req.user?._id));
    res.render('details', { electronic });
});

catalogRouter.get('/search', async (req, res) => {
    const { name, type } = req.query;

    const electronics = await searchElectronic(name, type);

    res.render('search', { data: { name, type }, electronics });
});

module.exports = { catalogRouter };