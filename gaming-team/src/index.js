const express = require('express');
const { configExpress } = require('./config/express');
const { configHbs } = require('./config/hbs');
const { configDatabase } = require('./config/database');
const { configRoutes } = require('./config/routes');
const { login, register } = require('./services/user');
const { createToken, verifyToken } = require('./services/jwt');
const { createGame } = require('./services/game');

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
        // Register user
        // const result = await register('peter@abv.bg', 'peter', '1234');

        // const token = createToken(result);

        // console.log(token);

        // const parsedData = verifyToken(token);
        // console.log(parsedData);
        
        //Create entry
        const result = await createGame({
            name: 'Mortal Kombat 11',
            image: 'http://localhost:3000/static/images/mortal-kombat.png',
            price: 50,
            description: 'Mortal Kombat 11 is a 2019 fighting game developed by NetherRealm Studios and published by Warner Bros. Interactive Entertainment. It is the eleventh main installment in the Mortal Kombat series and a sequel to Mortal Kombat X (2015). In this action-packed game, players can expect everything from martial arts to magic, ninja battles, robots, and iconic violence. The gameplay features returning elements like Fatalities, Brutalities, Stage Fatalities, Friendships, and Quitalities, along with new additions such as Fatal Blows and Krushing Blows.',
            genre: 'Fighting',
            platform: 'PC',
        }, '6677073e54a465f154f1ea07');
        // console.log(result);
    } catch (error) {
        console.log('Caught error!');
        console.log(error.message);
    }
}