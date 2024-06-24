const { Electronic } = require('../models/Electronic');


async function getAll() {
    return Electronic.find().lean();
}

async function getById(id) {
    return Electronic.findById(id).lean();
}

async function createElectronic(data, authorId) {

    const record = new Electronic({
        name: data.name,
        type: data.type,
        damages: data.damages,
        image: data.image,
        description: data.description,
        production: data.production,
        exploitation: data.exploitation,
        price: data.price,
        author: authorId
    });

    await record.save();

    return record;
}

async function updateElectronic(id, data, userId) {

    const record = await Electronic.findById(id);

    if (!record) {
        throw new Error('Record not found' + id);
    }

    if (record.author.toString() != userId) {
        throw new Error('Access Denied!');
    }

    record.name = data.name,
        record.type = data.type,
        record.damages = data.damages,
        record.image = data.image,
        record.description = data.description,
        record.production = data.production,
        record.exploitation = data.exploitation,
        record.price = data.price,

        await record.save();
    return record;

}
async function deleteById(id, userId) {

    const record = await Electronic.findById(id);

    if (!record) {
        throw new ReferenceError('Record not found' + id);
    }

    if (record.author.toString() != userId) {
        throw new Error('Access Denied!');
    }

    await Electronic.findByIdAndDelete(id);
}

async function buyElectronic(electronicId, userId) {
    const record = await Electronic.findById(electronicId);

    if (!record) {
        throw new ReferenceError('Record not found' + electronicId);
    }

    if (record.author.toString() == userId) {
        throw new Error('Cannot buy your own product!');
    }
    if (record.buyingList.find(buy => buy.toString() == userId)) {
        throw new Error('You can only buy this product once!');
    }

    record.buyingList.push(userId);

    await record.save();
    return record;
}

async function searchElectronic(name, type) {
    const query = {};

    if (name) {
        query.name = new RegExp(name, 'i');
    }

    if (type) {
        query.type = new RegExp(type, 'i');
    }
    return Electronic.find(query).lean();
}

module.exports = {
    getAll,
    getById,
    updateElectronic,
    createElectronic,
    deleteById,
    buyElectronic,
    searchElectronic
};