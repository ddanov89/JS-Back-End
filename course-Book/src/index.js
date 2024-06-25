const express = require('express');
const { configExpress } = require('./config/express');
const { configHbs } = require('./config/hbs');
const { configDatabase } = require('./config/database');
const { configRoutes } = require('./config/routes');

const { login, register } = require('./services/user');
const { createToken, verifyToken } = require('./services/jwt');
const { createCourse } = require('./services/course');

const PORT = process.env.PORT || 3000;

start();

async function start() {

    const app = express();

    await configDatabase()
    configHbs(app);
    configExpress(app);
    configRoutes(app);

    app.listen(PORT, () => {
        console.log(`Server started http://localhost:${PORT}!`);
        // testFunction();
    });
}

async function testFunction() {

    try {
        const result = await createCourse({
            title: 'Spanish 1-4: Beginner, Elementary',
            type: 'Language',
            certificate: 'Yes',
            image: 'https://wpvip.edutopia.org/wp-content/uploads/2022/10/johnson-169hero-effectivelearn-shutterstock_1.jpg?w=2880&quality=85',
            description: 'Curabitur fringilla nec urna sit amet eleifend. Suspendisse sodales vitae tellus sit amet dictum. Vivamus condimentum blandit interdum. Donec ac placerat enim. Pellentesque elementum condimentum massa, id condimentum lorem maximus sit amet. Vivamus accumsan imperdiet urna, eget malesuada felis iaculis quis. Nunc orci neque, blandit nec lorem eu, mattis porta erat. Etiam et imperdiet tellus. Nulla ac gravida tellus.',
            price: 15,
            
        }, '667564c29e18a3933bf9919c');
        console.log(result);
        
    } catch (error) {
        console.log('Caught error!');
        console.log(error.message);
    }
}