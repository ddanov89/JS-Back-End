const express = require('express');
const { configExpress } = require('./config/express');
const { configHbs } = require('./config/hbs');
const { configDatabase } = require('./config/database');
const { configRoutes } = require('./config/routes');
// const { login, register } = require('./services/user');
// const { createToken, verifyToken } = require('./services/jwt');

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
    });
}

// async function testFunction() {

//     try {
//         const result = await login('John', '123456');
//         console.log(result);

//         const token = createToken(result);

//         console.log(token);

//         const parsedData = verifyToken(token);
//         console.log(parsedData);
        
//     } catch (error) {
//         console.log('Caught error!');
//         console.log(error.message);
//     }
// }