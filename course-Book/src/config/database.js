const mongoose = require('mongoose');

require('../models/User');
require('../models/Course');

async function configDatabase() {
    const connectionString = 'mongodb://0.0.0.0:27017/course-book';

    await mongoose.connect(connectionString);
    console.log("Database connected!");
}

module.exports = { configDatabase };