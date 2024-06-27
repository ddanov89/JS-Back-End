const { Router } = require('express');
const { getAllGames, getGameById, searchGames } = require('../services/game');

const catalogRouter = Router();

catalogRouter.get('/catalog', async (req, res) => {
    const games = await getAllGames();
    res.render('catalog', { games });
});

catalogRouter.get('/catalog/:id', async (req, res) => {
    const gameId = req.params.id;
    const game = await getGameById(gameId);

    if (!game) {
        res.status(404).render('404');
    }
    game.buys = game.boughtBy.length;

    game.hasUser = res.locals.hasUser;
    game.isAuthor = req.user._id == game.author.toString();
    game.hasBeenBought = Boolean(game.boughtBy.find(b => b.toString() == req.user._id));

    res.render('details', { game });
});

catalogRouter.get('/search', async (req, res) => {

    const { name, platform } = req.query;

    const games = await searchGames(name, platform);

    res.render('search', { data: { name, platform }, games });
});

module.exports = { catalogRouter };