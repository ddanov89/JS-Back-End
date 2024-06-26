const mongoose = require('mongoose');

require('../models/User');
require('../models/Stone'); 

async function configDatabase() {
    //TODO set database name
    const connectionString = 'mongodb://0.0.0.0:27017/earth-treasure';

    await mongoose.connect(connectionString);
    console.log("Database connected!");
}

module.exports = { configDatabase };