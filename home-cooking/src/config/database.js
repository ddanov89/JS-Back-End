const mongoose = require('mongoose');

require('../models/User');
require('../models/Recipe');

async function configDatabase() {
    const connectionString = 'mongodb://0.0.0.0:27017/home-cooking-recipes';

    await mongoose.connect(connectionString);
    console.log("Database connected!");
}

module.exports = { configDatabase };