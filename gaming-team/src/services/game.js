const { Game } = require('../models/Game');

async function getAllGames() {

    return Game.find().lean();
}

async function getGameById(id) {

    return Game.findById(id).lean();
}

async function createGame(data, authorId) {

    const record = new Game({
        name: data.name,
        image: data.image,
        price: data.price,
        description: data.description,
        genre: data.genre,
        platform: data.platform,
        author: authorId
    });

    await record.save();

    return record;
}

async function updateGame(id, data, userId) {

    const record = await Game.findById(id);

    if (!record) {
        throw new Error('Record not found' + id);
    }

    if (record.author.toString() != userId) {
        throw new Error('Access Denied!');
    }

    record.name = data.name,
        record.image = data.image,
        record.price = data.price,
        record.description = data.description,
        record.genre = data.genre,
        record.platform = data.platform

    await record.save();

    return record;

}

async function deleteGameById(id, userId) {

    const record = await Game.findById(id);

    if (!record) {
        throw new ReferenceError('Record not found' + id);
    }

    if (record.author.toString() != userId) {
        throw new Error('Access denied!');
    }

    await Game.findByIdAndDelete(id);
}

async function searchGames(name, platform) {

    const query = {};

    if (name) {
        query.name = new RegExp(name, 'i');
    }
    if (platform && platform != '---') {
        query.platform = platform;
    }
    return Game.find(query).lean();
}

async function buyGame(gameId, userId) {
    const record = await Game.findById(gameId);

    if (!record) {
        throw new ReferenceError('Record not found' + gameId);
    }
    if (record.author.toString() == userId) {
        throw new Error('Cannot buy your own product!');
    }
    if (record.boughtBy.find(buy => buy.toString() == userId)) {
        throw new Error('You can only buy this product once!');
    }
    record.boughtBy.push(userId);
    await record.save();
    return record;
}

module.exports = {
    getAllGames,
    getGameById,
    createGame,
    updateGame,
    deleteGameById,
    searchGames,
    buyGame
};