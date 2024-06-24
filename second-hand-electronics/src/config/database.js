const mongoose = require('mongoose');

require('../models/User');
require('../models/Electronic'); 

async function configDatabase() {
    const connectionString = 'mongodb://0.0.0.0:27017/second-hand-electronics';

    await mongoose.connect(connectionString);
    console.log("Database connected!");
}

module.exports = { configDatabase };