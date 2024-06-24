const express = require('express');
const { configExpress } = require('./config/express');
const { configHbs } = require('./config/hbs');
const { configDatabase } = require('./config/database');
const { configRoutes } = require('./config/routes');
const { login, register } = require('./services/user');
const { createToken, verifyToken } = require('./services/jwt');
const { createElectronic } = require('./services/electronic');

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
        // test();
    });
}

async function test() {

    try {
        //Register user
        // const result = await register('john@abv.bg', 'john', '123');
        // console.log(result);

        // const token = createToken(result);

        // console.log(token);

        // const parsedData = verifyToken(token);
        // console.log(parsedData);
        
        //Create entry
        const result = await createElectronic({
            name: 'Ipad tablet 2023',
            type: 'tablet',
            damages: 'The product has minimal signs of use, not affecting its functionality.',
            image: 'http://localhost:3000/static/image/tablet.webp',
            description: 'Apple iPad (10th Generation): This iPad remains a solid choice, offering a 10.9-inch display, good performance, and compatibility with various accessories. It’s a great option for most people1.Amazon Fire HD 10 (2023): An overall excellent Amazon tablet with a 10-inch display, suitable for entertainment and productivity tasks1.Samsung Galaxy Tab S9 FE+: A midrange Android tablet known for its balance of features and performance1.Lenovo Tab P11 (2nd Gen): A tablet with long battery life, an 11.5-inch LCD, and decent camera capabilities1.CHUWI Upgraded Android 13 Tablet: Offers 10.51-inch display, 10GB RAM, and 128GB storage, making it a good budget-friendly choice',
            production: 2023,
            exploitation: 1,
            price: 3000, 
        }, '6676a02dc51b5969532c6d78');
        console.log(result);
    } catch (error) {
        console.log('Caught error!');
        console.log(error.message);
    }
}